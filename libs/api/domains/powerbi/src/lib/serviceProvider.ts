import { ConfigType, LazyDuringDevScope } from '@island.is/nest/config'
import { Provider } from '@nestjs/common'
import { PowerBiConfig } from './powerbi.config'
import { PowerBiService } from './powerbi.service'

export const PowerBiServiceProvider: Provider<PowerBiService> = {
  provide: PowerBiService,
  scope: LazyDuringDevScope,
  useFactory(config: ConfigType<typeof PowerBiConfig>) {
    return new PowerBiService(config)
  },
  inject: [PowerBiConfig.KEY],
}
