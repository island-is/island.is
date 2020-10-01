module.exports = {
  stories: [
    '../../core/src/**/*.stories.@(tsx|mdx)',
  ],
  addons: [
    '@storybook/addon-knobs/register',
    '@storybook/addon-a11y/register',
    '@storybook/addon-docs',
  ],
}
