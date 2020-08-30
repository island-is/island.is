export const environment = {
  production: false,
  elastic: {
    node: process.env.ELASTIC_NODE || 'https://test01es.stefna.is',
  },
}
