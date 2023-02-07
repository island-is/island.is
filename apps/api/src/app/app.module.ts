import { Module } from '@nestjs/common'
import { ApolloDriver } from '@nestjs/apollo'
import { GraphQLModule } from '@nestjs/graphql'
import { TerminusModule } from '@nestjs/terminus'
//import responseCachePlugin from 'apollo-server-plugin-response-cache'
import { AuthModule as AuthDomainModule } from '@island.is/api/domains/auth'
import { ContentSearchModule } from '@island.is/api/domains/content-search'
import { CmsModule } from '@island.is/cms'
import { DisabilityLicenseModule } from '@island.is/api/domains/disability-license'
import { DrivingLicenseModule } from '@island.is/api/domains/driving-license'
import { DrivingLicenseBookClientConfig } from '@island.is/clients/driving-license-book'
import { DrivingLicenseBookModule } from '@island.is/api/domains/driving-license-book'
import { EducationModule } from '@island.is/api/domains/education'
import { ApplicationModule } from '@island.is/api/domains/application'
import { DirectorateOfLabourModule } from '@island.is/api/domains/directorate-of-labour'
import { FileUploadModule } from '@island.is/api/domains/file-upload'
import { DocumentModule } from '@island.is/api/domains/documents'
import { CommunicationsModule } from '@island.is/api/domains/communications'
import { EmailSignupModule } from '@island.is/api/domains/email-signup'
import { ZenterSignupConfig } from '@island.is/api/domains/email-signup'
import { CmsTranslationsModule } from '@island.is/cms-translations'
import { UserProfileModule } from '@island.is/api/domains/user-profile'
import { NationalRegistryModule } from '@island.is/api/domains/national-registry'
import { HealthInsuranceModule } from '@island.is/api/domains/health-insurance'
import { IdentityModule } from '@island.is/api/domains/identity'
import { AuthConfig, AuthModule } from '@island.is/auth-nest-tools'
import { HealthController } from './health.controller'
import { getConfig } from './environments'
import { ApiCatalogueModule } from '@island.is/api/domains/api-catalogue'
import { DocumentProviderModule } from '@island.is/api/domains/document-provider'
import { SyslumennClientConfig } from '@island.is/clients/syslumenn'
import { SyslumennModule } from '@island.is/api/domains/syslumenn'
import { ElectronicRegistrationsClientConfig } from '@island.is/clients/electronic-registration-statistics'
import { ElectronicRegistrationsModule } from '@island.is/api/domains/electronic-registration-statistics'
import { FiskistofaClientConfig } from '@island.is/clients/fiskistofa'
import { FiskistofaModule } from '@island.is/api/domains/fiskistofa'
import { CompanyRegistryModule } from '@island.is/api/domains/company-registry'
import { IcelandicNamesModule } from '@island.is/api/domains/icelandic-names-registry'
import { RegulationsModule } from '@island.is/api/domains/regulations'
import { FinanceModule } from '@island.is/api/domains/finance'
import { VehiclesModule } from '@island.is/api/domains/vehicles'
import { AssetsModule } from '@island.is/api/domains/assets'
import { PassportModule } from '@island.is/api/domains/passport'
import { AirDiscountSchemeModule } from '@island.is/api/domains/air-discount-scheme'
import { EndorsementSystemModule } from '@island.is/api/domains/endorsement-system'
import { NationalRegistryXRoadModule } from '@island.is/api/domains/national-registry-x-road'
import { ApiDomainsPaymentModule } from '@island.is/api/domains/payment'
import {
  GenericAdrLicenseConfig,
  GenericDrivingLicenseConfig,
  GenericFirearmLicenseConfig,
  GenericMachineLicenseConfig,
  GenericDisabilityLicenseConfig,
  LicenseServiceModule,
} from '@island.is/api/domains/license-service'
import { PaymentScheduleModule } from '@island.is/api/domains/payment-schedule'
import { AssetsClientConfig } from '@island.is/clients/assets'
import { AuthPublicApiClientConfig } from '@island.is/clients/auth/public-api'
import { FinanceClientConfig } from '@island.is/clients/finance'
import { NationalRegistryClientConfig } from '@island.is/clients/national-registry-v2'
import { AuditModule } from '@island.is/nest/audit'
import {
  ConfigModule,
  DownloadServiceConfig,
  IdsClientConfig,
  XRoadConfig,
} from '@island.is/nest/config'
import { FeatureFlagConfig } from '@island.is/nest/feature-flags'
import { ProblemModule } from '@island.is/nest/problem'
import { CriminalRecordModule } from '@island.is/api/domains/criminal-record'
import { MunicipalitiesFinancialAidModule } from '@island.is/api/domains/municipalities-financial-aid'
import { MunicipalitiesFinancialAidConfig } from '@island.is/clients/municipalities-financial-aid'
import { MortgageCertificateModule } from '@island.is/api/domains/mortgage-certificate'
import { TransportAuthorityApiModule } from '@island.is/api/domains/transport-authority'
import { PowerBiModule } from '@island.is/api/domains/powerbi'
import { PowerBiConfig } from '@island.is/api/domains/powerbi'

import { maskOutFieldsMiddleware } from './graphql.middleware'
import { FishingLicenseModule } from '@island.is/api/domains/fishing-license'
import { CompanyRegistryConfig } from '@island.is/clients/rsk/company-registry'
import { DrivingLicenseApiConfig } from '@island.is/clients/driving-license'
import { VehiclesClientConfig } from '@island.is/clients/vehicles'
import { FishingLicenseClientConfig } from '@island.is/clients/fishing-license'
import { FinancialStatementsInaoModule } from '@island.is/api/domains/financial-statements-inao'
import { AdrAndMachineLicenseClientConfig } from '@island.is/clients/adr-and-machine-license'
import { FirearmLicenseClientConfig } from '@island.is/clients/firearm-license'
import { DisabilityLicenseClientConfig } from '@island.is/clients/disability-license'
import { PassportsClientConfig } from '@island.is/clients/passports'
import { FileStorageConfig } from '@island.is/file-storage'
import { AuthDelegationApiClientConfig } from '@island.is/clients/auth/delegation-api'
import { AirDiscountSchemeClientConfig } from '@island.is/clients/air-discount-scheme'
import { FinancialStatementsInaoClientConfig } from '@island.is/clients/financial-statements-inao'
import { ChargeFjsV2ClientConfig } from '@island.is/clients/charge-fjs-v2'
import { PaymentScheduleClientConfig } from '@island.is/clients/payment-schedule'
import { CommunicationsConfig } from '@island.is/api/domains/communications'

const debug = process.env.NODE_ENV === 'development'
const playground = debug || process.env.GQL_PLAYGROUND_ENABLED === 'true'
const environment = getConfig
const autoSchemaFile = environment.production
  ? true
  : 'apps/api/src/api.graphql'

@Module({
  controllers: [HealthController],
  imports: [
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      debug,
      playground,
      autoSchemaFile,
      path: '/api/graphql',
      buildSchemaOptions: {
        fieldMiddleware: [maskOutFieldsMiddleware],
      },
      plugins: [
        // This was causing problems since graphql upgrade, gives us issues like:
        // Error: overallCachePolicy.policyIfCacheable is not a function
        // responseCachePlugin({
        //   shouldReadFromCache: ({ request: { http } }) => {
        //     const bypassCacheKey = http?.headers.get('bypass-cache-key')
        //     return bypassCacheKey !== process.env.BYPASS_CACHE_KEY
        //   },
        // }),
      ],
    }),

    AuthDomainModule,
    AuditModule.forRoot(environment.audit),
    ContentSearchModule,
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
      documentsServiceBasePath: environment.documentProviderService
        .documentsServiceBasePath!,
      documentProviderAdmins: environment.documentProviderService
        .documentProviderAdmins!,
    }),
    CmsTranslationsModule,
    TerminusModule,
    NationalRegistryModule.register({
      nationalRegistry: {
        baseSoapUrl: environment.nationalRegistry.baseSoapUrl!,
        user: environment.nationalRegistry.user!,
        password: environment.nationalRegistry.password!,
        host: environment.nationalRegistry.host!,
      },
    }),
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
      userProfileServiceBasePath: environment.userProfile
        .userProfileServiceBasePath!,
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
    AuthModule.register(environment.auth as AuthConfig),
    SyslumennModule,
    DisabilityLicenseModule,
    ElectronicRegistrationsModule,
    FiskistofaModule,
    PowerBiModule,
    CompanyRegistryModule,
    IcelandicNamesModule.register({
      backendUrl: environment.icelandicNamesRegistry.backendUrl!,
    }),
    EndorsementSystemModule.register({
      baseApiUrl: environment.endorsementSystem.baseApiUrl!,
    }),
    RegulationsModule.register({
      url: environment.regulationsDomain.url!,
    }),
    FinanceModule,
    FinancialStatementsInaoModule,
    VehiclesModule,
    AssetsModule,
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
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        AdrAndMachineLicenseClientConfig,
        AirDiscountSchemeClientConfig,
        AssetsClientConfig,
        FirearmLicenseClientConfig,
        DisabilityLicenseClientConfig,
        GenericFirearmLicenseConfig,
        GenericMachineLicenseConfig,
        GenericAdrLicenseConfig,
        GenericDrivingLicenseConfig,
        GenericDisabilityLicenseConfig,
        VehiclesClientConfig,
        AuthPublicApiClientConfig,
        AuthDelegationApiClientConfig,
        DownloadServiceConfig,
        FeatureFlagConfig,
        FinanceClientConfig,
        IdsClientConfig,
        NationalRegistryClientConfig,
        SyslumennClientConfig,
        ElectronicRegistrationsClientConfig,
        FeatureFlagConfig,
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
        PowerBiConfig,
        ChargeFjsV2ClientConfig,
        DisabilityLicenseClientConfig,
        ZenterSignupConfig,
        PaymentScheduleClientConfig,
        CommunicationsConfig,
      ],
    }),
  ],
})
export class AppModule {}
