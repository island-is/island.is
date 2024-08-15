// import { createEnhancedFetch } from '@island.is/clients/middlewares'
// import {
//   ConfigType,
//   IdsClientConfig,
//   LazyDuringDevScope,
//   XRoadConfig,
// } from '@island.is/nest/config'
// import { HealthDirectorateClientConfig } from './clients/occupational-license/healthDirectorateClient.config'
// import {
//   Configuration,
//   StarfsleyfiAMinumSidumApi,
//   UmsoknStarfsleyfiApi,
//   VottordApi,
// } from './clients/occupational-license/gen/fetch'
// import { Api, Scope } from './healthDirectorateClient.types'
// import {
//   DonationExceptionsApi,
//   MeDonorStatusApi,
//   Configuration as OrganDonationConfiguration,
// } from './clients/organ-donation/gen/fetch'
// import {
//   MeVaccinationsApi,
//   Configuration as VaccinationConfiguration,
// } from './clients/vaccinations/gen/fetch'
// import { OrganDonationClientConfig } from './clients/organ-donation/organDonation.config'
// import { VaccinationsClientConfig } from './clients/vaccinations/vaccinations.config'

// const apiCollection: Array<{
//   api: Api
//   scopes: Array<Scope>
//   configuration:
//     | typeof OrganDonationConfiguration
//     | typeof VaccinationConfiguration
//     | typeof Configuration
//   clientConfig:
//     | typeof HealthDirectorateClientConfig
//     | typeof OrganDonationClientConfig
//     | typeof VaccinationsClientConfig
//   autoAuth: boolean
// }> = [
//   {
//     api: StarfsleyfiAMinumSidumApi,
//     scopes: ['@landlaeknir.is/starfsleyfi'],
//     configuration: Configuration,
//     clientConfig: HealthDirectorateClientConfig,
//     autoAuth: true,
//   },
//   {
//     api: VottordApi,
//     scopes: ['@landlaeknir.is/starfsleyfi'],
//     configuration: Configuration,
//     clientConfig: HealthDirectorateClientConfig,
//     autoAuth: true,
//   },
//   {
//     api: UmsoknStarfsleyfiApi,
//     scopes: ['@landlaeknir.is/starfsleyfi'],
//     configuration: Configuration,
//     clientConfig: HealthDirectorateClientConfig,
//     autoAuth: true,
//   },
//   {
//     api: MeDonorStatusApi,
//     scopes: [],
//     configuration: OrganDonationConfiguration,
//     clientConfig: OrganDonationClientConfig,
//     autoAuth: true,
//   },
//   {
//     api: DonationExceptionsApi,
//     scopes: [],
//     configuration: OrganDonationConfiguration,
//     clientConfig: OrganDonationClientConfig,
//     autoAuth: true,
//   },
//   {
//     api: MeVaccinationsApi,
//     scopes: [],
//     configuration: VaccinationConfiguration,
//     clientConfig: VaccinationsClientConfig,
//     autoAuth: true,
//   },
// ]

// export const apiProvider = apiCollection.map((apiRecord) => ({
//   provide: apiRecord.api,
//   scope: LazyDuringDevScope,
//   useFactory: (
//     xRoadConfig: ConfigType<typeof XRoadConfig>,
//     config: ConfigType<typeof apiRecord.clientConfig>,
//     idsClientConfig: ConfigType<typeof IdsClientConfig>,
//   ) => {
//     return new apiRecord.api()
//   },
//   inject: [
//     XRoadConfig.KEY,
//     HealthDirectorateClientConfig.KEY,
//     IdsClientConfig.KEY,
//   ],
// }))
