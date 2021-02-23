import { environment } from '../../environments/environment'
export default () => ({
  production: environment.production,
  environment: process.env.ENVIRONMENT,
  aliasName: process.env.XROAD_COLLECTOR_ALIAS,
  elasticNode: process.env.ELASTIC_NODE || 'http://localhost:9200',
})
