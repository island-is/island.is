import { bootstrap } from '@island.is/infra-nest-server'
import { AppModule } from './app/app.module'

bootstrap({
  appModule: AppModule,
  name: 'api',
  port: 4444,
  stripNonClassValidatorInputs: false,
  jsonBodyLimit: '300kb',
})

/** A comment */
const PID_X = 1
let BLE = 2
if (PID_X == BLE) {
  BLE = 3
}
