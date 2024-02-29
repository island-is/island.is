import { createRedisCluster } from '@island.is/cache'
import { LicenseClientModule } from '@island.is/clients/license-client'
import { CmsModule } from '@island.is/cms'
import { logger, LOGGER_PROVIDER } from '@island.is/logging'
import { ConfigModule } from '@island.is/nest/config'
import { CacheModule } from '@nestjs/cache-manager'
import { DynamicModule, Module } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { redisInsStore } from 'cache-manager-ioredis-yet'

import { MainResolver } from '../../../license-service/src/lib/graphql/main.resolver'
import { LicenseServiceService } from '../../../license-service/src/lib/licenseService.service'
import { AdrLicensePayloadMapper } from '../../../license-service/src/lib/mappers/adrLicenseMapper'
import { DisabilityLicensePayloadMapper } from '../../../license-service/src/lib/mappers/disabilityLicenseMapper'
import { DrivingLicensePayloadMapper } from '../../../license-service/src/lib/mappers/drivingLicenseMapper'
import { EHICCardPayloadMapper } from '../../../license-service/src/lib/mappers/ehicCardMapper'
import { FirearmLicensePayloadMapper } from '../../../license-service/src/lib/mappers/firearmLicenseMapper'
import { LicenseMapperModule } from '../../../license-service/src/lib/mappers/licenseMapper.module'
import { MachineLicensePayloadMapper } from '../../../license-service/src/lib/mappers/machineLicenseMapper'
import { PCardPayloadMapper } from '../../../license-service/src/lib/mappers/pCardMapper'
import {
  GenericLicenseMapper,
  GenericLicenseType,
  LicenseConfig,
} from './licenceService.type'
import { LicenseServiceConfig } from './licenseService.config'
import {
  LICENSE_MAPPER_FACTORY,
  TOKEN_SERVICE_PROVIDER,
} from './licenseService.constants'
import { TokenService } from './services/token.service'

@Module({})
export class LicenseServiceModule {
  static register(config: LicenseConfig): DynamicModule {
    return {
      module: LicenseServiceModule,
      imports: [
        LicenseClientModule,
        LicenseMapperModule,
        CmsModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [LicenseServiceConfig],
        }),
        CacheModule.register({
          imports: [ConfigModule],
          useFactory: (
            licenseServiceConfig: ConfigType<typeof LicenseServiceConfig>,
          ) => {
            console.log('TODO fix me - Hello Snaer why are you not logging')
            return {
              store: redisInsStore(
                createRedisCluster({
                  name: 'license_service_cache',
                  ssl: licenseServiceConfig.redis.ssl,
                  nodes: licenseServiceConfig.redis.nodes,
                }),
              ),
            }
          },
          inject: [LicenseServiceConfig],
        }),
      ],
      providers: [
        MainResolver,
        LicenseServiceService,
        {
          provide: LOGGER_PROVIDER,
          useValue: logger,
        },
        {
          provide: TOKEN_SERVICE_PROVIDER,
          useValue: new TokenService(config.barcodeSecretKey),
        },
        {
          provide: LICENSE_MAPPER_FACTORY,
          useFactory:
            (
              adr: AdrLicensePayloadMapper,
              disability: DisabilityLicensePayloadMapper,
              machine: MachineLicensePayloadMapper,
              firearm: FirearmLicensePayloadMapper,
              driving: DrivingLicensePayloadMapper,
              pCard: PCardPayloadMapper,
              ehic: EHICCardPayloadMapper,
            ) =>
            async (
              type: GenericLicenseType,
            ): Promise<GenericLicenseMapper | null> => {
              switch (type) {
                case GenericLicenseType.AdrLicense:
                  return adr
                case GenericLicenseType.DisabilityLicense:
                  return disability
                case GenericLicenseType.MachineLicense:
                  return machine
                case GenericLicenseType.FirearmLicense:
                  return firearm
                case GenericLicenseType.DriversLicense:
                  return driving
                case GenericLicenseType.PCard:
                  return pCard
                case GenericLicenseType.Ehic:
                  return ehic
                default:
                  return null
              }
            },
          inject: [
            AdrLicensePayloadMapper,
            DisabilityLicensePayloadMapper,
            MachineLicensePayloadMapper,
            FirearmLicensePayloadMapper,
            DrivingLicensePayloadMapper,
            PCardPayloadMapper,
            EHICCardPayloadMapper,
          ],
        },
      ],
      exports: [LicenseServiceService],
    }
  }
}
