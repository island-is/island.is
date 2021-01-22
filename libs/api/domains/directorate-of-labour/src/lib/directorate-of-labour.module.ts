import { DynamicModule, Module } from '@nestjs/common'
import { VMSTClientModule } from '@island.is/vmst-client'

import { DirectorateOfLabourRepository } from './directorate-of-labour.repository'
import { DirectorateOfLabourResolver } from './directorate-of-labour.resolver'
import { DirectorateOfLabourService } from './directorate-of-labour.service'

const XROAD_BASE_PATH = process.env.XROAD_BASE_PATH ?? ''
const XROAD_CLIENT = process.env.XROAD_CLIENT_ID ?? ''
const VMST_API_KEY = process.env.VMST_API_KEY ?? ''

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
        VMSTClientModule.register({
          xRoadBasePath: XROAD_BASE_PATH,
          xRoadClient: XROAD_CLIENT,
          apiKey: VMST_API_KEY,
        }),
      ],
      exports: [],
    }
  }
}
