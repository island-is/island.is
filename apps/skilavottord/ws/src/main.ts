/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
console.log("--- main starting ---")
import { bootstrap } from '@island.is/infra-nest-server'
console.log("  - bootstrap was imported")
import { AppModule } from './app/app.module'
console.log("  - AppModule was imported")

//import { environment } from './environments'

bootstrap({

  appModule: AppModule,
  name: 'skilavottord-ws',
  //  port: 4242,
  port: 3333,
  //port: 4200,
})
console.log("  - after bootstrap")