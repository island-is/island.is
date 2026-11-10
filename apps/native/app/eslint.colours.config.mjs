// Colour migration check for the native app. Not part of the repo lint; run it
// on demand to see what still uses the palette instead of semantic tokens:
//
//   npx eslint -c apps/native/app/eslint.colours.config.mjs apps/native/app/src
//
// Add --format json to count by message.
import tsParser from '@typescript-eslint/parser'

export default [
  {
    files: ['**/*.ts', '**/*.tsx'],
    ignores: [
      '**/ui/utils/colors.ts',
      '**/ui/utils/tokens.ts',
      '**/ui/utils/theme.ts',
      '**/ui/utils/dynamic-color.ts',
      // licence artwork
      '**/ui/utils/licence-colours.ts',
      '**/graphql/**',
      // skeletons keep their own colours
      '**/ui/lib/skeleton/**',
    ],
    languageOptions: {
      parser: tsParser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    // the source's eslint-disable comments name rules this config doesn't load
    linterOptions: {
      noInlineConfig: true,
      reportUnusedDisableDirectives: 'off',
    },
    rules: {
      'no-restricted-syntax': [
        'warn',
        {
          selector:
            ":matches(MemberExpression[object.name='theme'], MemberExpression[object.property.name='theme'])[property.name=/^(color|shade|shades)$/]",
          message:
            'Use a semantic token from `theme.tokens` instead of the palette or shades.',
        },
        {
          selector:
            ':matches(Literal[value=/^#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/], TemplateElement[value.raw=/#[0-9a-fA-F]{3,8}\\b/])',
          message:
            'Use a semantic token from `theme.tokens` instead of a raw hex colour.',
        },
        {
          selector:
            ':matches(Literal[value=/^rgba?\\(/], TemplateElement[value.raw=/rgba?\\(/])',
          message:
            'Use a semantic token from `theme.tokens` instead of a raw rgb(a) colour.',
        },
        {
          selector:
            'Literal[value=/^(blue|blueberry|dark|mint|purple|red|roseTinted|yellow)[1-8]00$/]',
          message:
            'Pass a token value (or a token selector) instead of a palette key string.',
        },
        {
          selector:
            'ImportDeclaration[source.value=/(^|\\/)colors$/], ImportDeclaration[source.value=/^@\\/ui(\\/utils)?$/] > ImportSpecifier[imported.name=/^((blue|blueberry|dark|mint|purple|red|roseTinted|yellow)[1-8]00|white)$/]',
          message: 'Import semantic tokens instead of palette primitives.',
        },
      ],
    },
  },
]
