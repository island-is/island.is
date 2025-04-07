import { ApolloDriver } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { GraphQLModule } from '@nestjs/graphql'
import { TerminusModule } from '@nestjs/terminus'

import { AdministrationOfOccupationalSafetyAndHealthModule } from '@island.is/api/domains/administration-of-occupational-safety-and-health'
import { AirDiscountSchemeModule } from '@island.is/api/domains/air-discount-scheme'
import { AircraftRegistryModule } from '@island.is/api/domains/aircraft-registry'
import { ApiCatalogueModule } from '@island.is/api/domains/api-catalogue'
import { ApplicationModule } from '@island.is/api/domains/application'
import { AssetsModule } from '@island.is/api/domains/assets'
import { AuthModule as AuthDomainModule } from '@island.is/api/domains/auth'
import { AuthAdminModule } from '@island.is/api/domains/auth-admin'
import { CompanyRegistryModule } from '@island.is/api/domains/company-registry'
import { ConsultationPortalModule } from '@island.is/api/domains/consultation-portal'
import { ContentSearchModule } from '@island.is/api/domains/content-search'
import { DirectorateOfLabourModule } from '@island.is/api/domains/directorate-of-labour'
import { DisabilityLicenseModule } from '@island.is/api/domains/disability-license'
import { DocumentProviderModule } from '@island.is/api/domains/document-provider'
import { DocumentModule } from '@island.is/api/domains/documents'
import { DrivingLicenseModule } from '@island.is/api/domains/driving-license'
import { DrivingLicenseBookModule } from '@island.is/api/domains/driving-license-book'
import { EducationModule } from '@island.is/api/domains/education'
import { EducationV2Module } from '@island.is/api/domains/education'
import { SocialInsuranceModule } from '@island.is/api/domains/social-insurance'
import {
  EmailSignupModule,
  ZenterSignupConfig,
  CampaignMonitorSignupConfig,
} from '@island.is/api/domains/email-signup'
import { EndorsementSystemModule } from '@island.is/api/domains/endorsement-system'
import { EnergyFundsServiceModule } from '@island.is/api/domains/energy-funds'
import { FileUploadModule } from '@island.is/api/domains/file-upload'
import { FinanceModule } from '@island.is/api/domains/finance'
import { FinancialStatementsInaoModule } from '@island.is/api/domains/financial-statements-inao'
import { FishingLicenseModule } from '@island.is/api/domains/fishing-license'
import { FiskistofaModule } from '@island.is/api/domains/fiskistofa'
import { OccupationalLicensesModule } from '@island.is/api/domains/occupational-licenses'
import { OccupationalLicensesV2Module } from '@island.is/api/domains/occupational-licenses-v2'
import { HealthInsuranceModule } from '@island.is/api/domains/health-insurance'
import { HmsLoansModule } from '@island.is/api/domains/hms-loans'
import { HousingBenefitsModule } from '@island.is/api/domains/housing-benefits'
import { HousingBenefitCalculatorModule } from '@island.is/api/domains/housing-benefit-calculator'
import { IcelandicGovernmentInstitutionVacanciesModule } from '@island.is/api/domains/icelandic-government-institution-vacancies'
import { IcelandicNamesModule } from '@island.is/api/domains/icelandic-names-registry'
import {
  CommunicationsConfig,
  CommunicationsModule,
} from '@island.is/api/domains/communications'
import { IdentityModule } from '@island.is/api/domains/identity'
import { LicenseServiceModule } from '@island.is/api/domains/license-service'
import { OfficialJournalOfIcelandModule } from '@island.is/api/domains/official-journal-of-iceland'
import { OfficialJournalOfIcelandApplicationModule } from '@island.is/api/domains/official-journal-of-iceland-application'
import { MortgageCertificateModule } from '@island.is/api/domains/mortgage-certificate'
import { MunicipalitiesFinancialAidModule } from '@island.is/api/domains/municipalities-financial-aid'
import { NationalRegistryXRoadModule } from '@island.is/api/domains/national-registry-x-road'
import { NotificationsModule } from '@island.is/api/domains/notifications'
import { PassportModule } from '@island.is/api/domains/passport'
import { ApiDomainsPaymentModule } from '@island.is/api/domains/payment'
import { PaymentScheduleModule } from '@island.is/api/domains/payment-schedule'
import { RegulationsModule } from '@island.is/api/domains/regulations'
import { RegulationsAdminModule } from '@island.is/api/domains/regulations-admin'
import { RightsPortalModule } from '@island.is/api/domains/rights-portal'
import { SessionsModule } from '@island.is/api/domains/sessions'
import { ShipRegistryModule } from '@island.is/api/domains/ship-registry'
import { StatisticsModule } from '@island.is/api/domains/statistics'
import { SyslumennModule } from '@island.is/api/domains/syslumenn'
import { TransportAuthorityApiModule } from '@island.is/api/domains/transport-authority'
import { UniversityGatewayApiModule } from '@island.is/api/domains/university-gateway'
import { UserProfileModule } from '@island.is/api/domains/user-profile'
import { VehiclesModule } from '@island.is/api/domains/vehicles'
import {
  WatsonAssistantChatConfig,
  WatsonAssistantChatModule,
} from '@island.is/api/domains/watson-assistant-chat'
import { WorkMachinesModule } from '@island.is/api/domains/work-machines'
import { SeminarsModule } from '@island.is/api/domains/seminars-ver'
import { AuthConfig, AuthModule } from '@island.is/auth-nest-tools'
import { AdrAndMachineLicenseClientConfig } from '@island.is/clients/adr-and-machine-license'
import { AirDiscountSchemeClientConfig } from '@island.is/clients/air-discount-scheme'
import { AssetsClientConfig } from '@island.is/clients/assets'
import { AuthAdminApiClientConfig } from '@island.is/clients/auth/admin-api'
import { AuthDelegationApiClientConfig } from '@island.is/clients/auth/delegation-api'
import { AuthIdsApiClientConfig } from '@island.is/clients/auth/ids-api'
import { AuthPublicApiClientConfig } from '@island.is/clients/auth/public-api'
import { ChargeFjsV2ClientConfig } from '@island.is/clients/charge-fjs-v2'
import { ConsultationPortalClientConfig } from '@island.is/clients/consultation-portal'
import { DisabilityLicenseClientConfig } from '@island.is/clients/disability-license'
import { DrivingLicenseApiConfig } from '@island.is/clients/driving-license'
import { DrivingLicenseBookClientConfig } from '@island.is/clients/driving-license-book'
import { EnergyFundsClientConfig } from '@island.is/clients/energy-funds'
import { FinanceClientConfig } from '@island.is/clients/finance'
import { FinancialStatementsInaoClientConfig } from '@island.is/clients/financial-statements-inao'
import { FirearmLicenseClientConfig } from '@island.is/clients/firearm-license'
import { FishingLicenseClientConfig } from '@island.is/clients/fishing-license'
import { FiskistofaClientConfig } from '@island.is/clients/fiskistofa'
import { AircraftRegistryClientConfig } from '@island.is/clients/aircraft-registry'
import { UniversityCareersModule } from '@island.is/api/domains/university-careers'
import { UserNotificationClientConfig } from '@island.is/clients/user-notification'
import {
  HealthDirectorateClientConfig,
  HealthDirectorateVaccinationsClientConfig,
  HealthDirectorateOrganDonationClientConfig,
  HealthDirectorateHealthClientConfig,
  HealthDirectorateClientModule,
} from '@island.is/clients/health-directorate'
import {
  OfficialJournalOfIcelandClientConfig,
  OfficialJournalOfIcelandClientModule,
} from '@island.is/clients/official-journal-of-iceland'
import { OfficialJournalOfIcelandApplicationClientConfig } from '@island.is/clients/official-journal-of-iceland/application'
import { HmsLoansClientConfig } from '@island.is/clients/hms-loans'
import { HousingBenefitCalculatorClientConfig } from '@island.is/clients/housing-benefit-calculator'
import { IcelandicGovernmentInstitutionVacanciesClientConfig } from '@island.is/clients/icelandic-government-institution-vacancies'
import { RightsPortalClientConfig } from '@island.is/clients/icelandic-health-insurance/rights-portal'
import { InnaClientConfig } from '@island.is/clients/inna'
import { IntellectualPropertiesClientConfig } from '@island.is/clients/intellectual-properties'
import { JudicialAdministrationClientConfig } from '@island.is/clients/judicial-administration'
import {
  AdrDigitalLicenseClientConfig,
  DisabilityDigitalLicenseClientConfig,
  DrivingDigitalLicenseClientConfig,
  HuntingDigitalLicenseClientConfig,
  FirearmDigitalLicenseClientConfig,
  MachineDigitalLicenseClientConfig,
} from '@island.is/clients/license-client'
import { MunicipalitiesFinancialAidConfig } from '@island.is/clients/municipalities-financial-aid'
import { NationalRegistryClientConfig } from '@island.is/clients/national-registry-v2'
import { NationalRegistryV3ClientConfig } from '@island.is/clients/national-registry-v3'
import { PassportsClientConfig } from '@island.is/clients/passports'
import { PaymentScheduleClientConfig } from '@island.is/clients/payment-schedule'
import { RegulationsClientConfig } from '@island.is/clients/regulations'
import { RegulationsAdminClientConfig } from '@island.is/clients/regulations-admin'
import { CompanyRegistryConfig } from '@island.is/clients/rsk/company-registry'
import { SessionsApiClientConfig } from '@island.is/clients/sessions'
import { ShipRegistryClientConfig } from '@island.is/clients/ship-registry'
import { SignatureCollectionClientConfig } from '@island.is/clients/signature-collection'
import { SyslumennClientConfig } from '@island.is/clients/syslumenn'
import { HuntingLicenseClientConfig } from '@island.is/clients/hunting-license'
import { VehiclesClientConfig } from '@island.is/clients/vehicles'
import { WorkMachinesClientConfig } from '@island.is/clients/work-machines'
import { SeminarsClientConfig } from '@island.is/clients/seminars-ver'
import { CmsModule, Form, PowerBiConfig } from '@island.is/cms'
import { CmsTranslationsModule } from '@island.is/cms-translations'
import { FileStorageConfig } from '@island.is/file-storage'
import { AuditModule } from '@island.is/nest/audit'
import { DocumentsClientV2Config } from '@island.is/clients/documents-v2'
import { WorkAccidentClientConfig } from '@island.is/clients/work-accident-ver'

import {
  ConfigModule,
  DownloadServiceConfig,
  IdsClientConfig,
  XRoadConfig,
} from '@island.is/nest/config'
import { CodeOwnerInterceptor } from '@island.is/nest/core'
import { DataLoaderInterceptor } from '@island.is/nest/dataloader'
import { FeatureFlagConfig } from '@island.is/nest/feature-flags'
import { ProblemModule } from '@island.is/nest/problem'
import { LicenseConfig } from '@island.is/services/license'

import { IntellectualPropertiesModule } from '@island.is/api/domains/intellectual-properties'
import { NationalRegistryModule } from '@island.is/api/domains/national-registry'
import { SignatureCollectionModule } from '@island.is/api/domains/signature-collection'
import { RskRelationshipsClientConfig } from '@island.is/clients-rsk-relationships'
import { FinanceClientV2Config } from '@island.is/clients/finance-v2'
import { MMSClientConfig } from '@island.is/clients/mms'
import { PCardClientConfig } from '@island.is/clients/p-card'
import { DistrictCommissionersLicensesClientConfig } from '@island.is/clients/district-commissioners-licenses'
import { StatisticsClientConfig } from '@island.is/clients/statistics'
import { SocialInsuranceAdministrationClientConfig } from '@island.is/clients/social-insurance-administration'
import { UniversityGatewayApiClientConfig } from '@island.is/clients/university-gateway-api'
import { FormSystemClientConfig } from '@island.is/clients/form-system'
import { FormSystemModule } from '@island.is/api/domains/form-system'
import { HealthDirectorateModule } from '@island.is/api/domains/health-directorate'

import { VehiclesMileageClientConfig } from '@island.is/clients/vehicles-mileage'

import { getConfig } from './environments'
import { GraphqlOptionsFactory } from './graphql-options.factory'
import { GraphQLConfig } from './graphql.config'
import { HealthController } from './health.controller'
import { DocumentClientConfig } from '@island.is/clients/documents'
import {
  AgriculturalUniversityOfIcelandCareerClientConfig,
  UniversityOfIcelandCareerClientConfig,
  UniversityOfAkureyriCareerClientConfig,
  HolarUniversityCareerClientConfig,
  BifrostUniversityCareerClientConfig,
  IcelandUniversityOfTheArtsCareerClientConfig,
} from '@island.is/clients/university-careers'
import { HousingBenefitsConfig } from '@island.is/clients/hms-housing-benefits'
import { UserProfileClientConfig } from '@island.is/clients/user-profile'
import { LawAndOrderModule } from '@island.is/api/domains/law-and-order'
import { UltravioletRadiationClientConfig } from '@island.is/clients/ultraviolet-radiation'
import { JudicialSystemSPClientConfig } from '@island.is/clients/judicial-system-sp'
import { HealthInsuranceV2ClientConfig } from '@island.is/clients/icelandic-health-insurance/health-insurance'
import { VmstClientConfig } from '@island.is/clients/vmst'
import { FriggClientConfig } from '@island.is/clients/mms/frigg'
import { GradeClientConfig } from '@island.is/clients/mms/grade'
import { UmbodsmadurSkuldaraModule } from '@island.is/api/domains/umbodsmadur-skuldara'
import { UmbodsmadurSkuldaraClientConfig } from '@island.is/clients/ums-cost-of-living-calculator'
import { emailModuleConfig } from '@island.is/email-service'
import { ZendeskServiceConfig } from '@island.is/clients/zendesk'
import { VerdictsClientConfig } from '@island.is/clients/verdicts'
import { VerdictsModule } from '@island.is/api/domains/verdicts'
import { SecondarySchoolClientConfig } from '@island.is/clients/secondary-school'
import { SecondarySchoolApiModule } from '@island.is/api/domains/secondary-school'

const environment = getConfig

@Module({
  controllers: [HealthController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: DataLoaderInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CodeOwnerInterceptor,
    },
  ],
  imports: [
    GraphQLModule.forRootAsync({
      driver: ApolloDriver,
      useClass: GraphqlOptionsFactory,
    }),
    AuthDomainModule,
    AuditModule.forRoot(environment.audit),
    ContentSearchModule,
    ConsultationPortalModule,
    FormSystemModule,
    CmsModule,
    DrivingLicenseModule,
    DrivingLicenseBookModule,
    EducationModule.register({
      xroad: {
        baseUrl: environment.xroad.baseUrl!,
        clientId: environment.xroad.clientId!,
        services: {
          license: environment.education.xroadLicenseServiceId!,
          grade: environment.education.xroadGradeServiceId!,
        },
      },
      fileDownloadBucket: environment.education.fileDownloadBucket!,
    }),
    EducationV2Module,
    ApplicationModule.register({
      baseApiUrl: environment.applicationSystem.baseApiUrl!,
    }),
    LicenseServiceModule,
    DirectorateOfLabourModule,
    FileUploadModule,
    DocumentModule,
    DocumentProviderModule.register({
      test: {
        basePath: environment.documentProviderService.test.basePath!,
        clientId: environment.documentProviderService.test.clientId,
        clientSecret: environment.documentProviderService.test.clientSecret,
        tokenUrl: environment.documentProviderService.test.tokenUrl,
      },
      prod: {
        basePath: environment.documentProviderService.prod.basePath!,
        clientId: environment.documentProviderService.prod.clientId,
        clientSecret: environment.documentProviderService.prod.clientSecret,
        tokenUrl: environment.documentProviderService.prod.tokenUrl,
      },
      documentsServiceBasePath:
        environment.documentProviderService.documentsServiceBasePath!,
      documentProviderAdmins:
        environment.documentProviderService.documentProviderAdmins!,
    }),
    CmsTranslationsModule,
    TerminusModule,
    HealthInsuranceModule,
    UserProfileModule.register({
      islykill: {
        cert: environment.islykill.cert!,
        passphrase: environment.islykill.passphrase!,
        basePath: environment.islykill.basePath!,
      },
    }),
    CommunicationsModule,
    EmailSignupModule,
    ApiCatalogueModule,
    IdentityModule,
    NationalRegistryModule,
    AuthModule.register(environment.auth as AuthConfig),
    SyslumennModule,
    OccupationalLicensesModule,
    OccupationalLicensesV2Module,
    SocialInsuranceModule,
    HealthDirectorateClientModule,
    OfficialJournalOfIcelandClientModule,
    DisabilityLicenseModule,
    FiskistofaModule,
    WatsonAssistantChatModule,
    IcelandicGovernmentInstitutionVacanciesModule,
    AircraftRegistryModule,
    ShipRegistryModule,
    IntellectualPropertiesModule,
    StatisticsModule,
    UniversityCareersModule,
    OfficialJournalOfIcelandModule,
    OfficialJournalOfIcelandApplicationModule,
    CompanyRegistryModule,
    IcelandicNamesModule.register({
      backendUrl: environment.icelandicNamesRegistry.backendUrl!,
    }),
    EndorsementSystemModule.register({
      baseApiUrl: environment.endorsementSystem.baseApiUrl!,
    }),
    RegulationsModule,
    RegulationsAdminModule,
    FinanceModule,
    FinancialStatementsInaoModule,
    VehiclesModule,
    RightsPortalModule,
    AssetsModule,
    HmsLoansModule,
    HousingBenefitsModule,
    PassportModule,
    AirDiscountSchemeModule,
    NationalRegistryXRoadModule,
    NotificationsModule,
    ApiDomainsPaymentModule,
    PaymentScheduleModule,
    ProblemModule,
    MunicipalitiesFinancialAidModule,
    FishingLicenseModule,
    MortgageCertificateModule,
    TransportAuthorityApiModule,
    EnergyFundsServiceModule,
    WorkMachinesModule,
    SeminarsModule,
    AdministrationOfOccupationalSafetyAndHealthModule,
    UniversityGatewayApiModule,
    SessionsModule,
    AuthAdminModule,
    HousingBenefitCalculatorModule,
    SignatureCollectionModule,
    LawAndOrderModule,
    UmbodsmadurSkuldaraModule,
    HealthDirectorateModule,
    VerdictsModule,
    SecondarySchoolApiModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        FormSystemClientConfig,
        WorkMachinesClientConfig,
        SeminarsClientConfig,
        AirDiscountSchemeClientConfig,
        ConsultationPortalClientConfig,
        AssetsClientConfig,
        PCardClientConfig,
        DistrictCommissionersLicensesClientConfig,
        AdrAndMachineLicenseClientConfig,
        NationalRegistryV3ClientConfig,
        FirearmLicenseClientConfig,
        DisabilityLicenseClientConfig,
        AdrDigitalLicenseClientConfig,
        HuntingDigitalLicenseClientConfig,
        FirearmDigitalLicenseClientConfig,
        DisabilityDigitalLicenseClientConfig,
        MachineDigitalLicenseClientConfig,
        DrivingDigitalLicenseClientConfig,
        IntellectualPropertiesClientConfig,
        UserNotificationClientConfig,
        GraphQLConfig,
        VehiclesClientConfig,
        VehiclesMileageClientConfig,
        RightsPortalClientConfig,
        AuthPublicApiClientConfig,
        AuthDelegationApiClientConfig,
        DownloadServiceConfig,
        HuntingLicenseClientConfig,
        FeatureFlagConfig,
        HmsLoansClientConfig,
        HousingBenefitsConfig,
        FinanceClientConfig,
        FinanceClientV2Config,
        RegulationsAdminClientConfig,
        RegulationsClientConfig,
        IdsClientConfig,
        NationalRegistryClientConfig,
        SyslumennClientConfig,
        XRoadConfig,
        MunicipalitiesFinancialAidConfig,
        SocialInsuranceAdministrationClientConfig,
        CompanyRegistryConfig,
        FishingLicenseClientConfig,
        FinancialStatementsInaoClientConfig,
        DrivingLicenseBookClientConfig,
        DrivingLicenseApiConfig,
        PassportsClientConfig,
        FileStorageConfig,
        FiskistofaClientConfig,
        ChargeFjsV2ClientConfig,
        EnergyFundsClientConfig,
        DocumentClientConfig,
        DocumentsClientV2Config,
        ZenterSignupConfig,
        CampaignMonitorSignupConfig,
        PaymentScheduleClientConfig,
        JudicialAdministrationClientConfig,
        CommunicationsConfig,
        HealthDirectorateClientConfig,
        HealthDirectorateVaccinationsClientConfig,
        HealthDirectorateOrganDonationClientConfig,
        HealthDirectorateHealthClientConfig,
        OfficialJournalOfIcelandClientConfig,
        OfficialJournalOfIcelandApplicationClientConfig,
        InnaClientConfig,
        SessionsApiClientConfig,
        AuthAdminApiClientConfig,
        WatsonAssistantChatConfig,
        PowerBiConfig,
        AuthIdsApiClientConfig,
        IcelandicGovernmentInstitutionVacanciesClientConfig,
        RskRelationshipsClientConfig,
        AircraftRegistryClientConfig,
        ShipRegistryClientConfig,
        HousingBenefitCalculatorClientConfig,
        MMSClientConfig,
        AgriculturalUniversityOfIcelandCareerClientConfig,
        UniversityOfIcelandCareerClientConfig,
        UniversityOfAkureyriCareerClientConfig,
        HolarUniversityCareerClientConfig,
        BifrostUniversityCareerClientConfig,
        IcelandUniversityOfTheArtsCareerClientConfig,
        StatisticsClientConfig,
        SignatureCollectionClientConfig,
        UniversityGatewayApiClientConfig,
        LicenseConfig,
        UserProfileClientConfig,
        UltravioletRadiationClientConfig,
        JudicialSystemSPClientConfig,
        FriggClientConfig,
        GradeClientConfig,
        VmstClientConfig,
        HealthInsuranceV2ClientConfig,
        UmbodsmadurSkuldaraClientConfig,
        WorkAccidentClientConfig,
        ZendeskServiceConfig,
        emailModuleConfig,
        VerdictsClientConfig,
        SecondarySchoolClientConfig,
      ],
    }),
  ],
})
export class AppModule {}
