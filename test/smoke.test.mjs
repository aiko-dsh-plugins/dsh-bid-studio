import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const manifest = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'))
const patch = await readFile(new URL('../cordis.patch.yml', import.meta.url), 'utf8')
const client = await readFile(new URL('../lib/client.js', import.meta.url), 'utf8')

test('declares one installable host and browser bundle', async () => {
  assert.equal(manifest.name, 'aiko-dsh-bid-studio')
  assert.equal(manifest.dsh.bundle.patch, './cordis.patch.yml')
  assert.equal(manifest.dsh.client.platform, 'web')
  await import('../lib/index.js')
})

test('activates only the scene workflow provider and workbench', () => {
  assert.doesNotMatch(patch, /ontology-local|ontology-remote/)
  assert.match(patch, /@deepseek-ai\/dsh-workflow-worker-thread/)
  assert.match(patch, /name: aiko-dsh-bid-studio/)
})

test('consumes the independently installed ontology kernel', () => {
  assert.equal(manifest.peerDependencies['aiko-dsh-ontology-kernel'], '^0.1.2')
  assert.equal(manifest.exports['./ontology'], undefined)
})

test('browser artifact registers the public package id', () => {
  assert.match(client, /id: "aiko-dsh-bid-studio"/)
  assert.doesNotMatch(client, /@deepseek-ai\/dsh-bid-studio/)
})
