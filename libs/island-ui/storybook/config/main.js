module.exports = {
  stories: [
    '../../core/src/**/*.stories.@(tsx|mdx)',
    // '../../forms/src/**/*.stories.tsx',
  ],
  addons: [
    '@storybook/addon-knobs/register',
    '@storybook/addon-a11y/register',
    '@storybook/addon-docs',
  ],
}
