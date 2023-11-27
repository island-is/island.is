import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { SyslumennClientConfig } from '@island.is/clients/syslumenn'
import {
  ConfigModule,
  IdsClientConfig,
  XRoadConfig,
} from '@island.is/nest/config'
import { ProblemModule } from '@island.is/nest/problem'

import { SequelizeConfigService } from './sequelizeConfig.service'
import { ApplicationModule } from './modules/application/application.module'
import { DrivingLicenseBookClientConfig } from '@island.is/clients/driving-license-book'
import { NationalRegistryClientConfig } from '@island.is/clients/national-registry-v2'
import { FeatureFlagConfig } from '@island.is/nest/feature-flags'
import { DrivingLicenseApiConfig } from '@island.is/clients/driving-license'
import { MunicipalitiesFinancialAidConfig } from '@island.is/clients/municipalities-financial-aid'
import { FishingLicenseClientConfig } from '@island.is/clients/fishing-license'
import { signingModuleConfig } from '@island.is/dokobit-signing'
import { ApplicationFilesConfig } from '@island.is/application/api/files'
import { FileStorageConfig } from '@island.is/file-storage'
import { CompanyRegistryConfig } from '@island.is/clients/rsk/company-registry'
import { FinancialStatementsInaoClientConfig } from '@island.is/clients/financial-statements-inao'
import { PaymentModuleConfig } from '@island.is/application/api/payment'
import { ChargeFjsV2ClientConfig } from '@island.is/clients/charge-fjs-v2'
import { PassportsClientConfig } from '@island.is/clients/passports'
import { PaymentScheduleClientConfig } from '@island.is/clients/payment-schedule'
import { EhicClientConfig } from '@island.is/clients/ehic-client-v1'
import { JudicialAdministrationClientConfig } from '@island.is/clients/judicial-administration'
import { AuthPublicApiClientConfig } from '@island.is/clients/auth/public-api'
import { AlthingiOmbudsmanClientConfig } from '@island.is/clients/althingi-ombudsman'
import { DirectorateOfImmigrationClientConfig } from '@island.is/clients/directorate-of-immigration'

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    ApplicationModule,
    ProblemModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        IdsClientConfig,
        SyslumennClientConfig,
        XRoadConfig,
        DrivingLicenseApiConfig,
        DrivingLicenseBookClientConfig,
        NationalRegistryClientConfig,
        FeatureFlagConfig,
        MunicipalitiesFinancialAidConfig,
        FishingLicenseClientConfig,
        signingModuleConfig,
        ApplicationFilesConfig,
        FileStorageConfig,
        CompanyRegistryConfig,
        FinancialStatementsInaoClientConfig,
        PaymentModuleConfig,
        ChargeFjsV2ClientConfig,
        PassportsClientConfig,
        PaymentScheduleClientConfig,
        EhicClientConfig,
        JudicialAdministrationClientConfig,
        AuthPublicApiClientConfig,
        AlthingiOmbudsmanClientConfig,
        DirectorateOfImmigrationClientConfig,
      ],
    }),
  ],
})
export class AppModule {}
