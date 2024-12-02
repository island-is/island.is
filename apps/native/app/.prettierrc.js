module.exports = {
  singleQuote: true,
  semi: false,
  trailingComma: 'all',
  arrowParens: 'always',
  endOfLine: 'lf',
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      options: {
        parser: 'babel-ts',
      },
    },
  ],
}
