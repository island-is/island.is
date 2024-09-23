import { bootstrap, processJob } from '@island.is/infra-nest-server'
import { AppModule } from './app/app.module'
import { environment } from './environments'
import { openApi } from './openApi'

const job = processJob()

if (require.main === module || !environment.production) {
  bootstrap({
    appModule: AppModule,
    name: 'services-endorsements-api',
    openApi,
    port: 4246,
    stripNonClassValidatorInputs: false,
  })
}
