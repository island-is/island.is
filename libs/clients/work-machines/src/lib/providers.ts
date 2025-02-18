import {
  XRoadConfig,
  IdsClientConfig,
  LazyDuringDevScope,
} from '@island.is/nest/config'
import { ConfigType } from '@nestjs/config'
import {
  Configuration,
  LicenseApi,
  MachineCategoryApi,
  MachineLicenseTeachingApplicationApi,
  MachineModelsApi,
  MachineOwnerChangeApi,
  MachineParentCategoriesApi,
  MachineRequestInspectionApi,
  MachineStatusChangeApi,
  MachineStreetRegistrationApi,
  MachineSubCategoriesApi,
  MachineSupervisorChangeApi,
  MachineTypesApi,
  MachinesApi,
  MachinesDocumentApi,
  TechnicalInfoApi,
} from '../../gen/fetch'
import { WorkMachinesClientConfig } from './workMachines.config'
import { createEnhancedFetch } from '@island.is/clients/middlewares'

const ConfigFactory = (
  xroadConfig: ConfigType<typeof XRoadConfig>,
  config: ConfigType<typeof WorkMachinesClientConfig>,
  idsClientConfig: ConfigType<typeof IdsClientConfig>,
  acceptHeader: string,
) => ({
  fetchApi: createEnhancedFetch({
    name: 'clients-work-machines',
    organizationSlug: 'vinnueftirlitid',
    logErrorResponseBody: true,
    autoAuth: idsClientConfig.isConfigured
      ? {
          mode: 'tokenExchange',
          issuer: idsClientConfig.issuer,
          clientId: idsClientConfig.clientId,
          clientSecret: idsClientConfig.clientSecret,
          scope: config.fetch.scope,
        }
      : undefined,
  }),
  basePath: `${xroadConfig.xRoadBasePath}/r1/${config.xRoadServicePath}`,
  headers: {
    'X-Road-Client': xroadConfig.xRoadClient,
    Accept: acceptHeader,
  },
})

export class CustomMachineApi extends MachinesApi {}

export const apiProviders = [
  {
    api: MachinesApi,
    provide: MachinesApi,
    acceptHeader: 'application/vnd.ver.machines.hateoas.v1+json',
  },
  {
    api: CustomMachineApi,
    provide: CustomMachineApi,
    acceptHeader: 'application/vnd.ver.machine.hateoas.v1+json',
  },
  {
    api: MachineOwnerChangeApi,
    provide: MachineOwnerChangeApi,
    acceptHeader: 'application/json',
  },
  {
    api: MachineSupervisorChangeApi,
    provide: MachineSupervisorChangeApi,
    acceptHeader: 'application/json-patch+json',
  },
  {
    api: MachineCategoryApi,
    provide: MachineCategoryApi,
    acceptHeader: 'application/json',
  },
  {
    api: MachinesDocumentApi,
    provide: MachinesDocumentApi,
    acceptHeader: 'application/vnd.ver.hateoas.v1+json',
  },
  {
    api: MachineSupervisorChangeApi,
    provide: MachineSupervisorChangeApi,
    acceptHeader: 'application/json-patch+json',
  },
  {
    api: MachineStatusChangeApi,
    provide: MachineStatusChangeApi,
    acceptHeader: 'application/json-patch+json',
  },
  {
    api: MachineStreetRegistrationApi,
    provide: MachineStreetRegistrationApi,
    acceptHeader: 'application/json-patch+json',
  },
  {
    api: MachineRequestInspectionApi,
    provide: MachineRequestInspectionApi,
    acceptHeader: 'application/json-patch+json',
  },
  {
    api: MachineTypesApi,
    provide: MachineTypesApi,
    acceptHeader: 'application/json',
  },
  {
    api: MachineModelsApi,
    provide: MachineModelsApi,
    acceptHeader: 'application/json',
  },
  {
    api: MachineParentCategoriesApi,
    provide: MachineParentCategoriesApi,
    acceptHeader: 'application/json',
  },
  {
    api: MachineSubCategoriesApi,
    provide: MachineSubCategoriesApi,
    acceptHeader: 'application/json',
  },
  {
    api: TechnicalInfoApi,
    provide: TechnicalInfoApi,
    acceptHeader: 'application/json',
  },
  {
    api: LicenseApi,
    provide: LicenseApi,
    acceptHeader: 'application/json',
  },
  {
    api: MachineLicenseTeachingApplicationApi,
    provide: MachineLicenseTeachingApplicationApi,
    acceptHeader: 'application/json',
  },
].map(({ api, provide, acceptHeader }) => ({
  provide: provide,
  scope: LazyDuringDevScope,
  useFactory: (
    xRoadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof WorkMachinesClientConfig>,
    idsClientConfig: ConfigType<typeof IdsClientConfig>,
  ) => {
    return new api(
      new Configuration(
        ConfigFactory(xRoadConfig, config, idsClientConfig, acceptHeader),
      ),
    )
  },
  inject: [XRoadConfig.KEY, WorkMachinesClientConfig.KEY, IdsClientConfig.KEY],
}))
