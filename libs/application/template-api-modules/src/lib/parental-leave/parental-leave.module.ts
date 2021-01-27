import { DynamicModule } from '@nestjs/common'
import { VMSTClientModule } from '@island.is/vmst-client'
import { createXRoadAPIPath, XRoadMemberClass } from '@island.is/utils/api'

import { ParentalLeaveService } from './parental-leave.service'

interface ParentalLeaveModuleConfig {
  xRoadBasePathWithEnv: string
  xRoadVmstMemberCode: string
  xRoadVmstAPIPath: string
  xRoadVmstClientId: string
  vmstApiKey: string
}

export class ParentalLeaveModule {
  static register(config: ParentalLeaveModuleConfig): DynamicModule {
    return {
      module: ParentalLeaveModule,
      imports: [
        VMSTClientModule.register({
          xRoadPath: createXRoadAPIPath(
            config.xRoadBasePathWithEnv,
            XRoadMemberClass.GovernmentInstitution,
            config.xRoadVmstMemberCode,
            config.xRoadVmstAPIPath,
          ),
          xRoadClient: config.xRoadVmstClientId,
          apiKey: config.vmstApiKey,
        }),
      ],
      providers: [ParentalLeaveService],
      exports: [ParentalLeaveService],
    }
  }
}
