import { DynamicModule, Module } from '@nestjs/common'
import { TjodskraModule } from '@island.is/clients/tjodskra'
import { createXRoadAPIPath, XRoadMemberClass } from '@island.is/utils/api'

import { NationalRegistryXRoadResolver } from './national-registry-x-road.resolver'
import { NationalRegistryXRoadService } from './national-registry-x-road.service'

const XROAD_BASE_PATH_WITH_ENV = process.env.XROAD_BASE_PATH_WITH_ENV ?? ''
const XROAD_TJODSKRA_MEMBER_CODE = process.env.XROAD_TJODSKRA_MEMBER_CODE ?? ''
const XROAD_TJODSKRA_API_PATH = process.env.XROAD_TJODSKRA_API_PATH ?? ''
const XROAD_CLIENT_ID = process.env.XROAD_CLIENT_ID ?? ''

@Module({})
export class NationalRegistryXRoadModule {
  static register(): DynamicModule {
    return {
      module: NationalRegistryXRoadModule,
      providers: [NationalRegistryXRoadResolver, NationalRegistryXRoadService],
      imports: [
        TjodskraModule.register({
          xRoadPath: createXRoadAPIPath(
            XROAD_BASE_PATH_WITH_ENV,
            XRoadMemberClass.GovernmentInstitution,
            XROAD_TJODSKRA_MEMBER_CODE,
            XROAD_TJODSKRA_API_PATH,
          ),
          xRoadClient: XROAD_CLIENT_ID,
          token: 'bla', // TODO Use real token
        }),
      ],
      exports: [],
    }
  }
}
