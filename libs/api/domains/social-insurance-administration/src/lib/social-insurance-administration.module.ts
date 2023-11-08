import { DynamicModule, Module } from '@nestjs/common'

import { SocialInsuranceAdministrationClientModule } from '@island.is/clients/social-insurance-administration'
import {
  createXRoadAPIPath,
  XRoadMemberClass,
} from '@island.is/shared/utils/server'

import { SocialInsuranceAdministrationRepository } from './social-insurance-administration.repository'
import { SocialInsuranceAdministrationResolver } from './social-insurance-administration.resolver'
import { SocialInsuranceAdministrationService } from './social-insurance-administration.service'

const XROAD_BASE_PATH_WITH_ENV = process.env.XROAD_BASE_PATH_WITH_ENV ?? ''
const XROAD_SIA_MEMBER_CODE = process.env.XROAD_TR_MEMBER_CODE ?? ''
const XROAD_SIA_API_PATH = process.env.XROAD_TR_API_PATH ?? ''
const XROAD_SIA_API_KEY = process.env.XROAD_TR_API_KEY ?? ''
const XROAD_CLIENT_ID = process.env.XROAD_CLIENT_ID ?? ''
const XROAD_SIA_MEMBER_CLASS = XRoadMemberClass.GovernmentInstitution

@Module({})
export class SocialInsuranceAdministrationModule {
  static register(): DynamicModule {
    return {
      module: SocialInsuranceAdministrationModule,
      providers: [
        SocialInsuranceAdministrationResolver,
        SocialInsuranceAdministrationService,
        SocialInsuranceAdministrationRepository,
      ],
      imports: [
        SocialInsuranceAdministrationClientModule.register({
          xRoadPath: createXRoadAPIPath(
            XROAD_BASE_PATH_WITH_ENV,
            XROAD_SIA_MEMBER_CLASS,
            XROAD_SIA_MEMBER_CODE,
            XROAD_SIA_API_PATH,
          ),
          xRoadClient: XROAD_CLIENT_ID,
          apiKey: XROAD_SIA_API_KEY,
        }),
      ],
      exports: [],
    }
  }
}
