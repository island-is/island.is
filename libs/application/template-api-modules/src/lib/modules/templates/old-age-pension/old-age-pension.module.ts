import { DynamicModule } from '@nestjs/common';
import { BaseTemplateAPIModuleConfig } from '../../../types';
import { SharedTemplateAPIModule } from '../../shared';

import { ClientsTryggingastofnunModule } from '@island.is/clients/tryggingastofnun';
import {
    createXRoadAPIPath,
    XRoadMemberClass,
  } from '@island.is/shared/utils/server'

import { OldAgePensionService } from './old-age-pension.service';
import { ApplicationApiCoreModule } from '@island.is/application/api/core';
import { NationalRegistryClientModule } from '@island.is/clients/national-registry-v2';


//TODO: Use process.env
const XROAD_TR_MEMBER_CODE = process.env.XROAD_TR_MEMBER_CODE ?? ''
const XROAD_TR_API_PATH =  process.env.XROAD_TR_API_PATH ?? ''
const XROAD_CLIENT_ID = process.env.XROAD_CLIENT_ID ?? ''
const XROAD_TR_API_KEY =  process.env.XROAD_TR_API_KEY ?? ''

export class OldAgePensionModule {
   
        static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
          return {
            module: OldAgePensionModule,
            imports: [
                ClientsTryggingastofnunModule.register({
                xRoadPath: createXRoadAPIPath(
                  config.xRoadBasePathWithEnv,
                  XRoadMemberClass.GovernmentInstitution,
                  XROAD_TR_MEMBER_CODE,
                  XROAD_TR_API_PATH,
                ),
                xRoadClient: XROAD_CLIENT_ID,
                apiKey: XROAD_TR_API_KEY,
              }),
              SharedTemplateAPIModule.register(config),
              ApplicationApiCoreModule,
              NationalRegistryClientModule
            ],
            providers: [
                OldAgePensionService
            ],
            exports: [OldAgePensionService]
          }
        }
}
