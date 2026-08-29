import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import css from './BidStudio.module.css';
/** Render the wide or compact bid-workbench navigation button. */
export function BidNavigation({ wide, applicationId, open, useLayout }) {
    const active = useLayout(snapshot => snapshot.activeApplication === applicationId);
    return (_jsxs("button", { type: "button", className: css.nav, "data-active": active || undefined, "aria-label": "\u6295\u6807\u5DE5\u4F5C\u53F0", "aria-current": active ? 'page' : undefined, onClick: open, children: [_jsx("span", { className: css.navIcon, "aria-hidden": "true", children: "\u6807" }), wide && _jsx("span", { children: "\u6295\u6807\u5DE5\u4F5C\u53F0" })] }));
}
//# sourceMappingURL=BidNavigation.js.map