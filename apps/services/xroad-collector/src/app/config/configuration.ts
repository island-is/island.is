import { environment } from '../../environments/environment'
export default () => ({
  production: environment.production,
  environment: process.env.ENVIRONMENT,
  aliasName: process.env.XROAD_COLLECTOR_ALIAS,
  elasticNode: process.env.ELASTIC_NODE || 'http://localhost:9200',
  waitCheckIntervalMs: 5 * 1000, //Five seconds between checks
  waitCheckAbortMs: 3 * 60 * 1000, // Three minutes
})
