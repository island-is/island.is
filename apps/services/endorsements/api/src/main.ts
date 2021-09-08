import { bootstrap } from '@island.is/infra-nest-server'
import { AppModule } from './app/app.module'
import { openApi } from './openApi'
export { default as updateMetadata } from '../scripts/updateMetadata'

if (require.main === module) {
  bootstrap({
    appModule: AppModule,
    name: 'services-endorsements-api',
    openApi,
    port: 4246,
    swaggerPath: '',
    stripNonClassValidatorInputs: false,
  })
}
