import { runServer } from './infra/express-app'
import { routes } from './routes'

runServer({ routes })
