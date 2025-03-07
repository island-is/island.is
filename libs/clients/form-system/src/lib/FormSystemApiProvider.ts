import { Provider } from '@nestjs/common/interfaces/modules/provider.interface'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { ConfigType, LazyDuringDevScope } from '@island.is/nest/config'
import { FormSystemClientConfig } from './FormSystemClient.config'
import {
  Configuration,
  ApplicationsApi,
  FieldsApi,
  FormsApi,
  ListItemsApi,
  OrganizationsApi,
  ScreensApi,
  SectionsApi,
  FormApplicantTypesApi,
  FormCertificationTypesApi,
  OrganizationCertificationTypesApi,
} from '../../gen/fetch'

const provideApi = <T>(
  Api: new (configuration: Configuration) => T,
): Provider<T> => ({
  provide: Api,
  scope: LazyDuringDevScope,
  useFactory: (config: ConfigType<typeof FormSystemClientConfig>) =>
    new Api(
      new Configuration({
        fetchApi: createEnhancedFetch({
          name: 'form-system',
          organizationSlug: 'stafraent-island',
          logErrorResponseBody: true,
        }),
        basePath: config.basePath,
        headers: {
          Accept: 'application/json',
        },
      }),
    ),
  inject: [FormSystemClientConfig.KEY],
})

export const ApplicationsApiProvider = provideApi(ApplicationsApi)
export const FieldsApiProvider = provideApi(FieldsApi)
export const FormsApiProvider = provideApi(FormsApi)
export const ListItemsApiProvider = provideApi(ListItemsApi)
export const OrganizationsApiProvider = provideApi(OrganizationsApi)
export const ScreensApiProvider = provideApi(ScreensApi)
export const SectionsApiProvider = provideApi(SectionsApi)
export const FormApplicantProvider = provideApi(FormApplicantTypesApi)
export const CertificationsProvider = provideApi(FormCertificationTypesApi)
export const OrganizationCertificationsProvider = provideApi(
  OrganizationCertificationTypesApi,
)
