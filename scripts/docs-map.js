// Most Actual CSS components document themselves at components/<name>. These
// live elsewhere in the docs site; build links them and check verifies them.
export const COMPONENT_DOCS = {
  "app-nav": "components/app-navigation",
  busy: "components/button",
  flyout: "enhancements/flyout",
  join: "forms/joined-controls",
  menu: "enhancements/flyout",
  modal: "components/dialog",
  scrollspy: "enhancements/scrollspy",
  "status-bar": "enhancements/status-bar",
  tab: "enhancements/tabs",
  tooltip: "enhancements/tooltip"
};

export const componentDocPath = (name) => COMPONENT_DOCS[name] ?? `components/${name}`;
