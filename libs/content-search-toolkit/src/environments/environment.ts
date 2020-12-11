export const environment = {
  production: false,
  elastic: {
    node: process.env.ELASTIC_NODE || 'http://localhost:9200',
  },
  kibana: {
    url: process.env.KIBANA_URL || 'http://localhost:5601',
  },
}
