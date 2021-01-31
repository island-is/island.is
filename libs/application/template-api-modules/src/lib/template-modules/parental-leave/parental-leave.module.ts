import { DynamicModule } from '@nestjs/common'
import { VMSTClientModule } from '@island.is/vmst-client'
import { createXRoadAPIPath, XRoadMemberClass } from '@island.is/utils/api'

import { BaseTemplateAPIModuleConfig } from '../../types'
import { SharedTemplateAPIModule } from '../../shared'
import { ParentalLeaveService } from './parental-leave.service'

const XROAD_BASE_PATH_WITH_ENV = process.env.XROAD_BASE_PATH_WITH_ENV ?? ''
const XROAD_VMST_MEMBER_CODE = process.env.XROAD_VMST_MEMBER_CODE ?? ''
const XROAD_VMST_API_PATH = process.env.XROAD_VMST_API_PATH ?? ''
const VMST_API_KEY = process.env.VMST_API_KEY ?? ''
const XROAD_VMST_CLIENT_ID = process.env.XROAD_VMST_CLIENT_ID ?? ''

interface ParentalLeaveApiModuleConfig extends BaseTemplateAPIModuleConfig {}

export class ParentalLeaveModule {
  static register(config: ParentalLeaveApiModuleConfig): DynamicModule {
    return {
      module: ParentalLeaveModule,
      imports: [
        VMSTClientModule.register({
          xRoadPath: createXRoadAPIPath(
            XROAD_BASE_PATH_WITH_ENV,
            XRoadMemberClass.GovernmentInstitution,
            XROAD_VMST_MEMBER_CODE,
            XROAD_VMST_API_PATH,
          ),
          xRoadClient: XROAD_VMST_CLIENT_ID,
          apiKey: VMST_API_KEY,
        }),
        SharedTemplateAPIModule.register(config),
      ],
      providers: [ParentalLeaveService],
      exports: [ParentalLeaveService],
    }
  }
}
