import { bootstrap } from '@island.is/infra-nest-server'
import { AppModule } from './app/app.module'
import { environment } from './environments'
import { openApi } from './openApi'

if (require.main === module || !environment.production) {
  bootstrap({
    appModule: AppModule,
    name: 'services-endorsements-api',
    openApi,
    port: 4246,
    stripNonClassValidatorInputs: false,
  })
}
