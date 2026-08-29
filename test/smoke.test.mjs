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

test('activates the ontology adapters, workflow provider, and workbench', () => {
  assert.match(patch, /aiko-dsh-bid-studio\/ontology\/local/)
  assert.match(patch, /aiko-dsh-bid-studio\/ontology\r?$/m)
  assert.match(patch, /@deepseek-ai\/dsh-workflow-worker-thread/)
  assert.match(patch, /name: aiko-dsh-bid-studio/)
})

test('ships the ontology runtime without an exotic transitive dependency', async () => {
  assert.equal(manifest.dependencies['aiko-dsh-ontology-kernel'], undefined)
  await import('../lib/ontology/runtime.js')
  await import('../lib/ontology/local.js')
  await import('../lib/ontology/index.js')
})

test('browser artifact registers the public package id', () => {
  assert.match(client, /id: "aiko-dsh-bid-studio"/)
  assert.doesNotMatch(client, /@deepseek-ai\/dsh-bid-studio/)
})
