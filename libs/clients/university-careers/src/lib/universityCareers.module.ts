import { Module } from '@nestjs/common'
import { createClient, createConfig } from '../../gen/fetch/client'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
import type { OrganizationSlugType } from '@island.is/shared/constants'
import {
  ConfigType,
  IdsClientConfig,
  LazyDuringDevScope,
  XRoadConfig,
} from '@island.is/nest/config'
import { UniversityCareersClientService } from './universityCareers.service'
import { UNI_FACTORY, UniversityId } from './universityCareers.types'
import { AgriculturalUniversityOfIcelandCareerClientConfig } from './clients/agricultural-university-of-iceland/agriculturalUniversityOfIcelandCareerClient.config'
import { BifrostUniversityCareerClientConfig } from './clients/bifrost-university/bifrostUniversityCareerClient.config'
import { HolarUniversityCareerClientConfig } from './clients/holar-university/holarUniversityCareerClient.config'
import { UniversityOfAkureyriCareerClientConfig } from './clients/university-of-akureyri/universityOfAkureyriCareerClient.config'
import { UniversityOfIcelandCareerClientConfig } from './clients/university-of-iceland/universityOfIcelandCareerClient.config'
import { IcelandUniversityOfTheArtsCareerClientConfig } from './clients/iceland-university-of-the-arts/icelandUniversityOfTheArtsCareerClient.config'

@Module({
  providers: [
    {
      provide: UNI_FACTORY,
      scope: LazyDuringDevScope,
      useFactory: (
        xroadConfig: ConfigType<typeof XRoadConfig>,
        idsClientConfig: ConfigType<typeof IdsClientConfig>,
        lbhiConfig: ConfigType<
          typeof AgriculturalUniversityOfIcelandCareerClientConfig
        >,
        bifrostConfig: ConfigType<typeof BifrostUniversityCareerClientConfig>,
        hiConfig: ConfigType<typeof UniversityOfIcelandCareerClientConfig>,
        holarConfig: ConfigType<typeof HolarUniversityCareerClientConfig>,
        unakConfig: ConfigType<typeof UniversityOfAkureyriCareerClientConfig>,
        lhiConfig: ConfigType<
          typeof IcelandUniversityOfTheArtsCareerClientConfig
        >,
      ) => {
        const makeClient = (
          config: { xroadPath: string; scope: string[] },
          name: string,
          organizationSlug: OrganizationSlugType,
        ) =>
          createClient(
            createConfig({
              baseUrl: `${xroadConfig.xRoadBasePath}/r1/${config.xroadPath}`,
              headers: {
                'X-Road-Client': xroadConfig.xRoadClient,
                Accept: 'application/json',
              },
              fetch: createEnhancedFetch({
                name,
                organizationSlug,
                authSource: 'context',
                logErrorResponseBody: true,
                autoAuth: idsClientConfig.isConfigured
                  ? {
                      mode: 'tokenExchange',
                      issuer: idsClientConfig.issuer,
                      clientId: idsClientConfig.clientId,
                      clientSecret: idsClientConfig.clientSecret,
                      scope: config.scope,
                    }
                  : undefined,
              }),
            }),
          )

        return new Map([
          [
            UniversityId.AGRICULTURAL_UNIVERSITY_OF_ICELAND,
            makeClient(
              lbhiConfig,
              'clients-university-careers-lbhi',
              'landbunadarhaskoli-islands',
            ),
          ],
          [
            UniversityId.BIFROST_UNIVERSITY,
            makeClient(
              bifrostConfig,
              'clients-university-careers-bifrost',
              'bifrost',
            ),
          ],
          [
            UniversityId.UNIVERSITY_OF_ICELAND,
            makeClient(
              hiConfig,
              'clients-university-careers-hi',
              'haskoli-islands',
            ),
          ],
          [
            UniversityId.HOLAR_UNIVERSITY,
            makeClient(
              holarConfig,
              'clients-university-careers-holar',
              'holaskoli-haskolinn-a-holum',
            ),
          ],
          [
            UniversityId.UNIVERSITY_OF_AKUREYRI,
            makeClient(
              unakConfig,
              'clients-university-careers-unak',
              'haskolinn-a-akureyri',
            ),
          ],
          [
            UniversityId.ICELAND_UNIVERSITY_OF_THE_ARTS,
            makeClient(lhiConfig, 'clients-university-careers-lhi', 'lhi'),
          ],
        ])
      },
      inject: [
        XRoadConfig.KEY,
        IdsClientConfig.KEY,
        AgriculturalUniversityOfIcelandCareerClientConfig.KEY,
        BifrostUniversityCareerClientConfig.KEY,
        UniversityOfIcelandCareerClientConfig.KEY,
        HolarUniversityCareerClientConfig.KEY,
        UniversityOfAkureyriCareerClientConfig.KEY,
        IcelandUniversityOfTheArtsCareerClientConfig.KEY,
      ],
    },
    UniversityCareersClientService,
  ],
  exports: [UniversityCareersClientService],
})
export class UniversityCareersClientModule {}
