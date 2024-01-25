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
import {
  CommunicationsConfig,
  CommunicationsModule,
} from '@island.is/api/domains/communications'
import { CompanyRegistryModule } from '@island.is/api/domains/company-registry'
import { ConsultationPortalModule } from '@island.is/api/domains/consultation-portal'
import { ContentSearchModule } from '@island.is/api/domains/content-search'
import { CriminalRecordModule } from '@island.is/api/domains/criminal-record'
import { DirectorateOfLabourModule } from '@island.is/api/domains/directorate-of-labour'
import { DisabilityLicenseModule } from '@island.is/api/domains/disability-license'
import { DocumentProviderModule } from '@island.is/api/domains/document-provider'
import { DocumentModule } from '@island.is/api/domains/documents'
import { DrivingLicenseModule } from '@island.is/api/domains/driving-license'
import { DrivingLicenseBookModule } from '@island.is/api/domains/driving-license-book'
import { EducationModule } from '@island.is/api/domains/education'
import { ElectronicRegistrationsModule } from '@island.is/api/domains/electronic-registration-statistics'
import {
  EmailSignupModule,
  ZenterSignupConfig,
} from '@island.is/api/domains/email-signup'
import { EndorsementSystemModule } from '@island.is/api/domains/endorsement-system'
import { EnergyFundsServiceModule } from '@island.is/api/domains/energy-funds'
import { FileUploadModule } from '@island.is/api/domains/file-upload'
import { FinanceModule } from '@island.is/api/domains/finance'
import { FinancialStatementsInaoModule } from '@island.is/api/domains/financial-statements-inao'
import { FishingLicenseModule } from '@island.is/api/domains/fishing-license'
import { FiskistofaModule } from '@island.is/api/domains/fiskistofa'
import { HealthInsuranceModule } from '@island.is/api/domains/health-insurance'
import { HmsLoansModule } from '@island.is/api/domains/hms-loans'
import { HousingBenefitCalculatorModule } from '@island.is/api/domains/housing-benefit-calculator'
import { IcelandicGovernmentInstitutionVacanciesModule } from '@island.is/api/domains/icelandic-government-institution-vacancies'
import { IcelandicNamesModule } from '@island.is/api/domains/icelandic-names-registry'
import { IdentityModule } from '@island.is/api/domains/identity'
import { LicenseServiceModule } from '@island.is/api/domains/license-service'
import { MinistryOfJusticeModule } from '@island.is/api/domains/ministry-of-justice'
import { MortgageCertificateModule } from '@island.is/api/domains/mortgage-certificate'
import { MunicipalitiesFinancialAidModule } from '@island.is/api/domains/municipalities-financial-aid'
import { NationalRegistryXRoadModule } from '@island.is/api/domains/national-registry-x-road'
import { OccupationalLicensesModule } from '@island.is/api/domains/occupational-licenses'
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
import { UniversityOfIcelandModule } from '@island.is/api/domains/university-of-iceland'
import { UserProfileModule } from '@island.is/api/domains/user-profile'
import { VehiclesModule } from '@island.is/api/domains/vehicles'
import {
  WatsonAssistantChatConfig,
  WatsonAssistantChatModule,
} from '@island.is/api/domains/watson-assistant-chat'
import { WorkMachinesModule } from '@island.is/api/domains/work-machines'
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
import { ElectronicRegistrationsClientConfig } from '@island.is/clients/electronic-registration-statistics'
import { EnergyFundsClientConfig } from '@island.is/clients/energy-funds'
import { FinanceClientConfig } from '@island.is/clients/finance'
import { FinancialStatementsInaoClientConfig } from '@island.is/clients/financial-statements-inao'
import { FirearmLicenseClientConfig } from '@island.is/clients/firearm-license'
import { FishingLicenseClientConfig } from '@island.is/clients/fishing-license'
import { FiskistofaClientConfig } from '@island.is/clients/fiskistofa'
import { AircraftRegistryClientConfig } from '@island.is/clients/aircraft-registry'
import { UserNotificationClientConfig } from '@island.is/clients/user-notification'
import {
  HealthDirectorateClientConfig,
  HealthDirectorateClientModule,
} from '@island.is/clients/health-directorate'
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
  FirearmDigitalLicenseClientConfig,
  MachineDigitalLicenseClientConfig,
} from '@island.is/clients/license-client'
import { MunicipalitiesFinancialAidConfig } from '@island.is/clients/municipalities-financial-aid'
import { NationalRegistrySoffiaClientConfig } from '@island.is/clients/national-registry-v1'
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
import { UniversityOfIcelandClientConfig } from '@island.is/clients/university-of-iceland'
import { VehiclesClientConfig } from '@island.is/clients/vehicles'
import { WorkMachinesClientConfig } from '@island.is/clients/work-machines'
import { CmsModule, PowerBiConfig } from '@island.is/cms'
import { CmsTranslationsModule } from '@island.is/cms-translations'
import { FileStorageConfig } from '@island.is/file-storage'
import { AuditModule } from '@island.is/nest/audit'
import {
  ConfigModule,
  DownloadServiceConfig,
  IdsClientConfig,
  XRoadConfig,
} from '@island.is/nest/config'
import { DataLoaderInterceptor } from '@island.is/nest/dataloader'
import { FeatureFlagConfig } from '@island.is/nest/feature-flags'
import { ProblemModule } from '@island.is/nest/problem'

import { IntellectualPropertiesModule } from '@island.is/api/domains/intellectual-properties'
import { NationalRegistryModule } from '@island.is/api/domains/national-registry'
import { SignatureCollectionModule } from '@island.is/api/domains/signature-collection'
import { RskRelationshipsClientConfig } from '@island.is/clients-rsk-relationships'
import { FinanceClientV2Config } from '@island.is/clients/finance-v2'
import { MMSClientConfig } from '@island.is/clients/mms'
import { PCardClientConfig } from '@island.is/clients/p-card'
import { StatisticsClientConfig } from '@island.is/clients/statistics'
import { UniversityGatewayApiClientConfig } from '@island.is/clients/university-gateway-api'
import { VehiclesMileageClientConfig } from '@island.is/clients/vehicles-mileage'
import { getConfig } from './environments'
import { GraphqlOptionsFactory } from './graphql-options.factory'
import { GraphQLConfig } from './graphql.config'
import { HealthController } from './health.controller'

const environment = getConfig

@Module({
  controllers: [HealthController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: DataLoaderInterceptor,
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
      nationalRegistry: {
        baseSoapUrl: environment.nationalRegistry.baseSoapUrl!,
        user: environment.nationalRegistry.user!,
        password: environment.nationalRegistry.password!,
        host: environment.nationalRegistry.host!,
      },

      fileDownloadBucket: environment.education.fileDownloadBucket!,
    }),
    ApplicationModule.register({
      baseApiUrl: environment.applicationSystem.baseApiUrl!,
    }),
    LicenseServiceModule,
    DirectorateOfLabourModule.register(),
    FileUploadModule,
    DocumentModule.register({
      documentClientConfig: {
        basePath: environment.documentService.basePath!,
        clientId: environment.documentService.clientId,
        clientSecret: environment.documentService.clientSecret,
        tokenUrl: environment.documentService.tokenUrl,
      },
    }),
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
    HealthInsuranceModule.register({
      clientV2Config: {
        xRoadBaseUrl: environment.healthInsuranceV2.xRoadBaseUrl!,
        xRoadProviderId: environment.healthInsuranceV2.xRoadProviderId!,
        xRoadClientId: environment.healthInsuranceV2.xRoadClientId!,
        username: environment.healthInsuranceV2.username!,
        password: environment.healthInsuranceV2.password!,
      },
    }),
    UserProfileModule.register({
      userProfileServiceBasePath:
        environment.userProfile.userProfileServiceBasePath!,
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
    HealthDirectorateClientModule,
    DisabilityLicenseModule,
    ElectronicRegistrationsModule,
    FiskistofaModule,
    WatsonAssistantChatModule,
    IcelandicGovernmentInstitutionVacanciesModule,
    AircraftRegistryModule,
    ShipRegistryModule,
    IntellectualPropertiesModule,
    StatisticsModule,
    MinistryOfJusticeModule,
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
    PassportModule,
    AirDiscountSchemeModule,
    NationalRegistryXRoadModule,
    ApiDomainsPaymentModule,
    PaymentScheduleModule,
    ProblemModule,
    CriminalRecordModule.register({
      clientConfig: {
        xroadBaseUrl: environment.xroad.baseUrl!,
        xroadClientId: environment.xroad.clientId!,
        xroadPath: environment.criminalRecord.xroadPath!,
      },
    }),
    MunicipalitiesFinancialAidModule,
    FishingLicenseModule,
    MortgageCertificateModule,
    TransportAuthorityApiModule,
    EnergyFundsServiceModule,
    UniversityOfIcelandModule,
    WorkMachinesModule,
    AdministrationOfOccupationalSafetyAndHealthModule,
    UniversityGatewayApiModule,
    SessionsModule,
    AuthAdminModule,
    HousingBenefitCalculatorModule,
    SignatureCollectionModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        WorkMachinesClientConfig,
        AirDiscountSchemeClientConfig,
        ConsultationPortalClientConfig,
        AssetsClientConfig,
        PCardClientConfig,
        AdrAndMachineLicenseClientConfig,
        NationalRegistrySoffiaClientConfig,
        NationalRegistryV3ClientConfig,
        FirearmLicenseClientConfig,
        DisabilityLicenseClientConfig,
        AdrDigitalLicenseClientConfig,
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
        FeatureFlagConfig,
        HmsLoansClientConfig,
        FinanceClientConfig,
        FinanceClientV2Config,
        RegulationsAdminClientConfig,
        RegulationsClientConfig,
        IdsClientConfig,
        NationalRegistryClientConfig,
        SyslumennClientConfig,
        ElectronicRegistrationsClientConfig,
        XRoadConfig,
        MunicipalitiesFinancialAidConfig,
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
        ZenterSignupConfig,
        PaymentScheduleClientConfig,
        JudicialAdministrationClientConfig,
        CommunicationsConfig,
        HealthDirectorateClientConfig,
        UniversityOfIcelandClientConfig,
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
        StatisticsClientConfig,
        SignatureCollectionClientConfig,
        UniversityGatewayApiClientConfig,
      ],
    }),
  ],
})
export class AppModule {}
