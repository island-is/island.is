export const environment = {
  production: false,
  contentful: {
    space: '8k0h54kbe6bj',
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN || 'test',
    environment: 'master',
    host: 'preview.contentful.com',
  },
}
