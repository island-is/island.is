export const environment = {
  production: false,
  elastic: {
    node: process.env.ELASTIC_NODE || 'http://localhost:9200',
  },
}
