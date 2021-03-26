module.exports = {
  extends: 'airbnb-base',
  env: {
    browser: true,
    node: true,
  },
  globals: {
    document: false,
  },
  rules: {
    'max-len': ['error', { code: 150 }],
  },
};
