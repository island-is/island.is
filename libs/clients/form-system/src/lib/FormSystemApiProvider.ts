import { Provider } from '@nestjs/common/interfaces/modules/provider.interface'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
import {
  ConfigType,
  LazyDuringDevScope,
  IdsClientConfig,
} from '@island.is/nest/config'
import { FormSystemClientConfig } from './FormSystemClient.config'
import { Configuration, FilesApi, FormsApi, GroupsApi, InputsApi, OrganizationsApi, ServicesApi, StepsApi } from '../../gen/fetch'


const provideApi = <T>(
  Api: new (configuration: Configuration) => T,
): Provider<T> => ({
  provide: Api,
  scope: LazyDuringDevScope,
  useFactory: (
    config: ConfigType<typeof FormSystemClientConfig>,
    idsClientConfig: ConfigType<typeof IdsClientConfig>,
  ) =>
    new Api(
      new Configuration({
        fetchApi: createEnhancedFetch({
          name: 'form-system',
          organizationSlug: 'stafraent-island',
          logErrorResponseBody: true,
          autoAuth: idsClientConfig.isConfigured
            ? {
              mode: 'auto',
              issuer: idsClientConfig.issuer,
              clientId: idsClientConfig.clientId,
              clientSecret: idsClientConfig.clientSecret,
              scope: config.tokenExchangeScope,
            }
            : undefined,
        }),
        basePath: config.basePath,
        headers: {
          Accept: 'application/json',
        },
      }),
    ),
  inject: [FormSystemClientConfig.KEY, IdsClientConfig.KEY],
})

export const FilesApiProvider = provideApi(FilesApi)
export const FormsApiProvider = provideApi(FormsApi)
export const GroupsApiProvider = provideApi(GroupsApi)
export const InputsApiProvider = provideApi(InputsApi)
export const OrganizationsApiProvider = provideApi(OrganizationsApi)
export const ServicesApiProvider = provideApi(ServicesApi)
export const StepsApiProvider = provideApi(StepsApi)
