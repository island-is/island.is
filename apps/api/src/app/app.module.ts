import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { TerminusModule } from '@nestjs/terminus'
import responseCachePlugin from 'apollo-server-plugin-response-cache'

import { AuthModule as AuthDomainModule } from '@island.is/api/domains/auth'
import { ContentSearchModule } from '@island.is/api/domains/content-search'
import { CmsModule } from '@island.is/api/domains/cms'
import { DrivingLicenseModule } from '@island.is/api/domains/driving-license'
import { EducationModule } from '@island.is/api/domains/education'
import { ApplicationModule } from '@island.is/api/domains/application'
import { DirectorateOfLabourModule } from '@island.is/api/domains/directorate-of-labour'
import { FileUploadModule } from '@island.is/api/domains/file-upload'
import { DocumentModule } from '@island.is/api/domains/documents'
import { CommunicationsModule } from '@island.is/api/domains/communications'
import { TranslationsModule } from '@island.is/api/domains/translations'
import { UserProfileModule } from '@island.is/api/domains/user-profile'
import { NationalRegistryModule } from '@island.is/api/domains/national-registry'
import { HealthInsuranceModule } from '@island.is/api/domains/health-insurance'
import { IdentityModule } from '@island.is/api/domains/identity'
import { AuthModule } from '@island.is/auth-nest-tools'
import { HealthController } from './health.controller'
import { environment } from './environments'
import { ApiCatalogueModule } from '@island.is/api/domains/api-catalogue'
import { DocumentProviderModule } from '@island.is/api/domains/document-provider'
import { SyslumennModule } from '@island.is/api/domains/syslumenn'
import { RSKModule } from '@island.is/api/domains/rsk'
import { IcelandicNamesModule } from '@island.is/api/domains/icelandic-names-registry'
import { RegulationsModule } from '@island.is/api/domains/regulations'
import { FinanceModule } from '@island.is/api/domains/finance'
import { EndorsementSystemModule } from '@island.is/api/domains/endorsement-system'
import { NationalRegistryXRoadModule } from '@island.is/api/domains/national-registry-x-road'
import { ApiDomainsPaymentModule } from '@island.is/api/domains/payment'
import { TemporaryVoterRegistryModule } from '@island.is/api/domains/temporary-voter-registry'
import { PartyLetterRegistryModule } from '@island.is/api/domains/party-letter-registry'
import { LicenseServiceModule } from '@island.is/api/domains/license-service'
import { AuditModule } from '@island.is/nest/audit'

import { maskOutFieldsMiddleware } from './graphql.middleware'

const debug = process.env.NODE_ENV === 'development'
const playground = debug || process.env.GQL_PLAYGROUND_ENABLED === 'true'
const autoSchemaFile = environment.production
  ? true
  : 'apps/api/src/api.graphql'

// asynchronously registered modules
const nationalRegistryModule = NationalRegistryModule.register({
  config: {
    baseSoapUrl: environment.nationalRegistry.baseSoapUrl,
    user: environment.nationalRegistry.user,
    password: environment.nationalRegistry.password,
    host: environment.nationalRegistry.host,
  },
})
const nationalRegistryXRoadModule = NationalRegistryXRoadModule.register({
  xRoadBasePathWithEnv: environment.nationalRegistryXRoad.url,
  xRoadTjodskraMemberCode: environment.nationalRegistryXRoad.memberCode,
  xRoadTjodskraApiPath: environment.nationalRegistryXRoad.apiPath,
  xRoadClientId: environment.nationalRegistryXRoad.clientId,
})
const identityModule = IdentityModule.register({
  modules: [nationalRegistryModule],
})
const authDomainModule = AuthDomainModule.register({
  config: {
    authPublicApi: environment.authPublicApi,
  },
  modules: [identityModule],
})
const drivingLicenseModule = DrivingLicenseModule.register({
  xroadBaseUrl: environment.xroad.baseUrl,
  xroadClientId: environment.xroad.clientId,
  secret: environment.drivingLicense.secret,
})
const educationModule = EducationModule.register({
  config: {
    xroad: {
      baseUrl: environment.xroad.baseUrl,
      clientId: environment.xroad.clientId,
      services: {
        license: environment.education.xroadLicenseServiceId,
        grade: environment.education.xroadGradeServiceId,
      },
    },
    fileDownloadBucket: environment.education.fileDownloadBucket,
  },
  modules: [nationalRegistryModule],
})
const applicationModule = ApplicationModule.register({
  baseApiUrl: environment.applicationSystem.baseApiUrl,
})
const directorateOfLabourModule = DirectorateOfLabourModule.register()
const fileUploadModule = FileUploadModule.register({
  fileStorage: environment.fileStorage,
})
const documentModule = DocumentModule.register({
  documentClientConfig: {
    basePath: environment.documentService.basePath,
    clientId: environment.documentService.clientId,
    clientSecret: environment.documentService.clientSecret,
    tokenUrl: environment.documentService.tokenUrl,
  },
  downloadServiceConfig: {
    downloadServiceBaseUrl: environment.downloadService.baseUrl,
  },
})
const documentProviderModule = DocumentProviderModule.register({
  test: {
    basePath: environment.documentProviderService.test.basePath,
    clientId: environment.documentProviderService.test.clientId,
    clientSecret: environment.documentProviderService.test.clientSecret,
    tokenUrl: environment.documentProviderService.test.tokenUrl,
  },
  prod: {
    basePath: environment.documentProviderService.prod.basePath,
    clientId: environment.documentProviderService.prod.clientId,
    clientSecret: environment.documentProviderService.prod.clientSecret,
    tokenUrl: environment.documentProviderService.prod.tokenUrl,
  },
  documentsServiceBasePath:
    environment.documentProviderService.documentsServiceBasePath,
  documentProviderAdmins:
    environment.documentProviderService.documentProviderAdmins,
})
const healthInsuranceModule = HealthInsuranceModule.register({
  wsdlUrl: environment.healthInsurance.wsdlUrl,
  baseUrl: environment.healthInsurance.baseUrl,
  username: environment.healthInsurance.username,
  password: environment.healthInsurance.password,
  clientID: environment.healthInsurance.clientID,
  xroadID: environment.healthInsurance.xroadID,
})
const userProfileModule = UserProfileModule.register({
  userProfileServiceBasePath:
    environment.userProfile.userProfileServiceBasePath,
})
const authModule = AuthModule.register(environment.auth)
const syslumennModule = SyslumennModule.register({
  url: environment.syslumennService.url,
  username: environment.syslumennService.username,
  password: environment.syslumennService.password,
})
const rskModule = RSKModule.register({
  password: environment.rskDomain.password,
  url: environment.rskDomain.url,
  username: environment.rskDomain.username,
})
const icelandicNamesModule = IcelandicNamesModule.register({
  backendUrl: environment.icelandicNamesRegistry.backendUrl,
})
const endorsementSystemModule = EndorsementSystemModule.register({
  baseApiUrl: environment.endorsementSystem.baseApiUrl,
})
const temporaryVoterRegistryModule = TemporaryVoterRegistryModule.register({
  baseApiUrl: environment.temporaryVoterRegistry.baseApiUrl,
})
const regulationsModule = RegulationsModule.register({
  url: environment.regulationsDomain.url,
})
const financeModule = FinanceModule.register({
  username: environment.fjarmalDomain.username,
  password: environment.fjarmalDomain.password,
  ttl: environment.fjarmalDomain.ttl,
  downloadServiceBaseUrl: environment.downloadService.baseUrl,
  xroadApiPath: environment.fjarmalDomain.xroadApiPath,
  xroadBaseUrl: environment.xroad.baseUrl,
  xroadClientId: environment.xroad.clientId,
})
const apiDomainsPaymentModule = ApiDomainsPaymentModule.register({
  xRoadProviderId: environment.paymentDomain.xRoadProviderId,
  xRoadBaseUrl: environment.paymentDomain.xRoadBaseUrl,
  xRoadClientId: environment.xroad.clientId,
  password: environment.paymentDomain.password,
  username: environment.paymentDomain.username,
  callbackBaseUrl: environment.paymentDomain.callbackBaseUrl,
  callbackAdditionUrl: environment.paymentDomain.callbackAdditionUrl,
  arkBaseUrl: environment.paymentDomain.arkBaseUrl,
})
const partyLetterRegistryModule = PartyLetterRegistryModule.register({
  baseApiUrl: environment.partyLetterRegistry.baseApiUrl,
})
const licenseServiceModule = LicenseServiceModule.register({
  xroad: {
    baseUrl: environment.xroad.baseUrl,
    clientId: environment.xroad.clientId,
    path: environment.drivingLicense.xroadPath,
    secret: environment.drivingLicense.secret,
  },
  pkpass: {
    apiKey: environment.pkpass.apiKey,
    apiUrl: environment.pkpass.apiUrl,
    secretKey: environment.pkpass.secretKey,
  },
})

// app module
@Module({
  controllers: [HealthController],
  imports: [
    GraphQLModule.forRoot({
      debug,
      playground,
      autoSchemaFile,
      path: '/api/graphql',
      buildSchemaOptions: {
        fieldMiddleware: [maskOutFieldsMiddleware],
      },
      plugins: [
        responseCachePlugin({
          shouldReadFromCache: ({
            request: {
              http: { headers },
            },
          }) => {
            const bypassCacheKey = headers.get('bypass-cache-key')
            return bypassCacheKey !== process.env.BYPASS_CACHE_KEY
          },
        }),
      ],
    }),
    authDomainModule,
    AuditModule.forRoot(environment.audit),
    ContentSearchModule,
    CmsModule,
    drivingLicenseModule,
    educationModule,
    applicationModule,
    directorateOfLabourModule,
    fileUploadModule,
    documentModule,
    documentProviderModule,
    TranslationsModule,
    TerminusModule,
    nationalRegistryModule,
    healthInsuranceModule,
    userProfileModule,
    CommunicationsModule,
    ApiCatalogueModule,
    identityModule,
    authModule,
    syslumennModule,
    rskModule,
    icelandicNamesModule,
    endorsementSystemModule,
    temporaryVoterRegistryModule,
    regulationsModule,
    financeModule,
    nationalRegistryXRoadModule,
    apiDomainsPaymentModule,
    partyLetterRegistryModule,
    licenseServiceModule,
  ],
})
export class AppModule {}
