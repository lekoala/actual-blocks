export const dataGrid = {
  name: "data-grid-component",
  path: "assets/data-grid",
  styles: ["dist/data-grid.min.css", "themes/actual.css"],
  script: "dist/data-grid.min.js",
  license: "LICENSE",
  bundledLicense: {
    source: "@lekoala/floating/LICENSE",
    target: "floating.LICENSE.txt"
  }
};

export const dataGridTags = (base) => [
  ...dataGrid.styles.map((file) => `<link rel="stylesheet" href="${base}/${file}" />`),
  `<script type="module" src="${base}/${dataGrid.script}"></script>`
];
