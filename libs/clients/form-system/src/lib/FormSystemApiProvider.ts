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
  OrganizationPermissionsApi,
  OrganizationUrlsApi,
} from '../../gen/fetch'
import { ApiConfiguration } from './apiConfiguration'

const apis = [
  ApplicationsApi,
  FieldsApi,
  FormsApi,
  ListItemsApi,
  OrganizationsApi,
  ScreensApi,
  SectionsApi,
  FormApplicantTypesApi,
  FormCertificationTypesApi,
  OrganizationPermissionsApi,
  OrganizationUrlsApi,
]

export const exportedApis = apis.map((Api) => ({
  provide: Api,
  useFactory: (configuration: Configuration) => {
    return new Api(configuration)
  },
  inject: [ApiConfiguration.provide],
}))
