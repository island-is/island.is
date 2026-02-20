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
import { NationalRegistryV3ApplicationsClientConfig } from '@island.is/clients/national-registry-v3-applications'
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
import { CarRecyclingClientConfig } from '@island.is/clients/car-recycling'
import { ArborgWorkpoinClientConfig } from '@island.is/clients/workpoint/arborg'
import {
  SocialInsuranceAdministrationClientConfig,
  SocialInsuranceAdministrationClientConfigV2,
} from '@island.is/clients/social-insurance-administration'
import { SignatureCollectionClientConfig } from '@island.is/clients/signature-collection'
import { InnaClientConfig } from '@island.is/clients/inna'
import { OfficialJournalOfIcelandClientConfig } from '@island.is/clients/official-journal-of-iceland'
import { OfficialJournalOfIcelandApplicationClientConfig } from '@island.is/clients/official-journal-of-iceland/application'
import { LegalGazetteClientConfig } from '@island.is/clients/legal-gazette'
import {
  HealthDirectorateClientConfig,
  HealthDirectorateVaccinationsClientConfig,
  HealthDirectorateOrganDonationClientConfig,
  HealthDirectorateHealthClientConfig,
} from '@island.is/clients/health-directorate'
import {
  AgriculturalUniversityOfIcelandCareerClientConfig,
  BifrostUniversityCareerClientConfig,
  HolarUniversityCareerClientConfig,
  IcelandUniversityOfTheArtsCareerClientConfig,
  UniversityOfAkureyriCareerClientConfig,
  UniversityOfIcelandCareerClientConfig,
} from '@island.is/clients/university-careers'
import { DataProtectionComplaintClientConfig } from '@island.is/clients/data-protection-complaint'
import { HealthInsuranceV2ClientConfig } from '@island.is/clients/icelandic-health-insurance/health-insurance'
import { VmstClientConfig } from '@island.is/clients/vmst'
import { RightsPortalClientConfig } from '@island.is/clients/icelandic-health-insurance/rights-portal'
import { FriggClientConfig } from '@island.is/clients/mms/frigg'
import { smsModuleConfig } from '@island.is/nova-sms'
import { emailModuleConfig } from '@island.is/email-service'
import { sharedModuleConfig } from '@island.is/application/template-api-modules'
import { UserNotificationClientConfig } from '@island.is/clients/user-notification'
import { NationalRegistryV3ClientConfig } from '@island.is/clients/national-registry-v3'
import { SeminarsClientConfig } from '@island.is/clients/seminars-ver'
import {
  SecondarySchoolClientConfig,
  SecondarySchoolPublicClientConfig,
} from '@island.is/clients/secondary-school'
import { WorkMachinesClientConfig } from '@island.is/clients/work-machines'
import { BankInfoClientConfig } from '@island.is/clients/fjs/bank-info'
import { PaymentsApiClientConfig } from '@island.is/clients/payments'
import { VmstUnemploymentClientConfig } from '@island.is/clients/vmst-unemployment'
import { HmsRentalAgreementClientConfig } from '@island.is/clients/hms-rental-agreement'
import { ExemptionForTransportationClientConfig } from '@island.is/clients/transport-authority/exemption-for-transportation'

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
        NationalRegistryV3ApplicationsClientConfig,
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
        CarRecyclingClientConfig,
        ArborgWorkpoinClientConfig,
        SocialInsuranceAdministrationClientConfig,
        SocialInsuranceAdministrationClientConfigV2,
        SignatureCollectionClientConfig,
        InnaClientConfig,
        OfficialJournalOfIcelandClientConfig,
        OfficialJournalOfIcelandApplicationClientConfig,
        LegalGazetteClientConfig,
        HealthDirectorateVaccinationsClientConfig,
        HealthDirectorateOrganDonationClientConfig,
        HealthDirectorateClientConfig,
        HealthDirectorateHealthClientConfig,
        AgriculturalUniversityOfIcelandCareerClientConfig,
        BifrostUniversityCareerClientConfig,
        UniversityOfAkureyriCareerClientConfig,
        UniversityOfIcelandCareerClientConfig,
        HolarUniversityCareerClientConfig,
        IcelandUniversityOfTheArtsCareerClientConfig,
        DataProtectionComplaintClientConfig,
        HealthInsuranceV2ClientConfig,
        VmstClientConfig,
        RightsPortalClientConfig,
        FriggClientConfig,
        smsModuleConfig,
        emailModuleConfig,
        sharedModuleConfig,
        UserNotificationClientConfig,
        NationalRegistryV3ClientConfig,
        SeminarsClientConfig,
        SecondarySchoolClientConfig,
        SecondarySchoolPublicClientConfig,
        WorkMachinesClientConfig,
        BankInfoClientConfig,
        PaymentsApiClientConfig,
        VmstUnemploymentClientConfig,
        HmsRentalAgreementClientConfig,
        ExemptionForTransportationClientConfig,
      ],
    }),
  ],
})
export class AppModule {}
