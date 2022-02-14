import { DynamicModule, Module } from '@nestjs/common'

import { VMSTModule } from '@island.is/clients/vmst'
import {
  createXRoadAPIPath,
  XRoadMemberClass,
} from '@island.is/shared/utils/server'

import { DirectorateOfLabourRepository } from './directorate-of-labour.repository'
import { DirectorateOfLabourResolver } from './directorate-of-labour.resolver'
import { DirectorateOfLabourService } from './directorate-of-labour.service'

const XROAD_BASE_PATH_WITH_ENV = process.env.XROAD_BASE_PATH_WITH_ENV ?? ''
const XROAD_VMST_MEMBER_CODE = process.env.XROAD_VMST_MEMBER_CODE ?? ''
const XROAD_VMST_API_PATH = process.env.XROAD_VMST_API_PATH ?? ''
const XROAD_VMST_API_KEY = process.env.XROAD_VMST_API_KEY ?? ''
const XROAD_CLIENT_ID = process.env.XROAD_CLIENT_ID ?? ''
const XROAD_VMST_MEMBER_CLASS = XRoadMemberClass.GovernmentInstitution

@Module({})
export class DirectorateOfLabourModule {
  static register(): DynamicModule {
    return {
      module: DirectorateOfLabourModule,
      providers: [
        DirectorateOfLabourResolver,
        DirectorateOfLabourService,
        DirectorateOfLabourRepository,
      ],
      imports: [
        VMSTModule.register({
          xRoadPath: createXRoadAPIPath(
            XROAD_BASE_PATH_WITH_ENV,
            XROAD_VMST_MEMBER_CLASS,
            XROAD_VMST_MEMBER_CODE,
            XROAD_VMST_API_PATH,
          ),
          xRoadClient: XROAD_CLIENT_ID,
          apiKey: XROAD_VMST_API_KEY,
        }),
      ],
      exports: [],
    }
  }
}
