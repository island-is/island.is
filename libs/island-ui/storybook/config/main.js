module.exports = {
  stories: ['../../core/src/**/*.stories.@(tsx|mdx)'],
  addons: [
    '@storybook/addon-a11y/register',
    '@storybook/addon-docs',
    '@storybook/addon-essentials',
    '@storybook/addon-controls',
    'storybook-addon-designs',
    './title/register',
  ],
}
