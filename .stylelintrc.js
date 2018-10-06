module.exports = {
  syntax: 'scss',
  processors: [
    'stylelint-processor-styled-components',
  ],
  extends: [
    'stylelint-config-standard',
    'stylelint-config-styled-components',
  ],
  rules: {
    'block-no-empty': null,
    'no-duplicate-selectors': null,
  },
};
