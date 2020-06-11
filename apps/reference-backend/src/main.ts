import { runServer } from '@island.is/infra-express-server'
import { routes } from './routes'

runServer({ routes, name: 'reference-backend' })
