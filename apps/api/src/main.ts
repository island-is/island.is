import { runServer } from '@island.is/infra-express-server'
import createGraphqlServer from './graphql'

const routes = createGraphqlServer()

runServer({ routes, name: 'api', port: 4444 })
