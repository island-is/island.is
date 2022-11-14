import { Module } from '@nestjs/common'
import { ApolloDriver } from '@nestjs/apollo'
import { GraphQLModule } from '@nestjs/graphql'
import { TerminusModule } from '@nestjs/terminus'
//import responseCachePlugin from 'apollo-server-plugin-response-cache'
import { AuthModule as AuthDomainModule } from '@island.is/api/domains/auth'
import { ContentSearchModule } from '@island.is/api/domains/content-search'
import { CmsModule } from '@island.is/cms'
import { DrivingLicenseModule } from '@island.is/api/domains/driving-license'
import { DrivingLicenseBookClientConfig } from '@island.is/clients/driving-license-book'
import { DrivingLicenseBookModule } from '@island.is/api/domains/driving-license-book'
import { EducationModule } from '@island.is/api/domains/education'
import { ApplicationModule } from '@island.is/api/domains/application'
import { DirectorateOfLabourModule } from '@island.is/api/domains/directorate-of-labour'
import { FileUploadModule } from '@island.is/api/domains/file-upload'
import { DocumentModule } from '@island.is/api/domains/documents'
import { CommunicationsModule } from '@island.is/api/domains/communications'
import { MailchimpModule } from '@island.is/api/domains/mailchimp'
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
import { CompanyRegistryModule } from '@island.is/api/domains/company-registry'
import { IcelandicNamesModule } from '@island.is/api/domains/icelandic-names-registry'
import { RegulationsModule } from '@island.is/api/domains/regulations'
import { FinanceModule } from '@island.is/api/domains/finance'
import { VehiclesModule } from '@island.is/api/domains/vehicles'
import { AssetsModule } from '@island.is/api/domains/assets'
import { EndorsementSystemModule } from '@island.is/api/domains/endorsement-system'
import { NationalRegistryXRoadModule } from '@island.is/api/domains/national-registry-x-road'
import { ApiDomainsPaymentModule } from '@island.is/api/domains/payment'
import {
  GenericAdrLicenseConfig,
  GenericDrivingLicenseConfig,
  GenericFirearmLicenseConfig,
  GenericMachineLicenseConfig,
  LicenseServiceModule,
} from '@island.is/api/domains/license-service'
import { PaymentScheduleModule } from '@island.is/api/domains/payment-schedule'
import { AssetsClientConfig } from '@island.is/clients/assets'
import { AssetsV2ClientConfig } from '@island.is/clients/assets-v2'
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

import { maskOutFieldsMiddleware } from './graphql.middleware'
import { FishingLicenseModule } from '@island.is/api/domains/fishing-license'
import { CompanyRegistryConfig } from '@island.is/clients/rsk/company-registry'
import { DrivingLicenseApiConfig } from '@island.is/clients/driving-license'
import { VehiclesClientConfig } from '@island.is/clients/vehicles'
import { FishingLicenseClientConfig } from '@island.is/clients/fishing-license'
import { FinancialStatementsInaoModule } from '@island.is/api/domains/financial-statements-inao'
import { AdrAndMachineLicenseClientConfig } from '@island.is/clients/adr-and-machine-license'
import { FirearmLicenseClientConfig } from '@island.is/clients/firearm-license'
import { PassportsClientConfig } from '@island.is/clients/passports'
import { FileStorageConfig } from '@island.is/file-storage'
import { AuthDelegationApiClientConfig } from '@island.is/clients/auth/delegation-api'

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
    MailchimpModule,
    ApiCatalogueModule,
    IdentityModule,
    AuthModule.register(environment.auth as AuthConfig),
    SyslumennModule,
    ElectronicRegistrationsModule,
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
    NationalRegistryXRoadModule,
    ApiDomainsPaymentModule.register({
      xRoadProviderId: environment.paymentDomain.xRoadProviderId!,
      xRoadBaseUrl: environment.paymentDomain.xRoadBaseUrl!,
      xRoadClientId: environment.xroad.clientId!,
      password: environment.paymentDomain.password!,
      username: environment.paymentDomain.username!,
      callbackBaseUrl: environment.paymentDomain.callbackBaseUrl!,
      callbackAdditionUrl: environment.paymentDomain.callbackAdditionUrl!,
      arkBaseUrl: environment.paymentDomain.arkBaseUrl!,
    }),
    PaymentScheduleModule.register({
      xRoadProviderId: environment.paymentSchedule.xRoadProviderId!,
      xRoadBaseUrl: environment.paymentSchedule.xRoadBaseUrl!,
      xRoadClientId: environment.xroad.clientId!,
      password: environment.paymentSchedule.password!,
      username: environment.paymentSchedule.username!,
    }),
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
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        AdrAndMachineLicenseClientConfig,
        AssetsClientConfig,
        AssetsV2ClientConfig,
        FirearmLicenseClientConfig,
        GenericFirearmLicenseConfig,
        GenericMachineLicenseConfig,
        GenericAdrLicenseConfig,
        GenericDrivingLicenseConfig,
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
        DrivingLicenseBookClientConfig,
        DrivingLicenseApiConfig,
        PassportsClientConfig,
        FileStorageConfig,
      ],
    }),
  ],
})
export class AppModule {}
