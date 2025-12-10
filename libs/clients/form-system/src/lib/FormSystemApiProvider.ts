import {
  ApplicationsApi,
  Configuration,
  FieldsApi,
  FilesApi,
  FormApplicantTypesApi,
  FormCertificationTypesApi,
  FormsApi,
  FormUrlsApi,
  ListItemsApi,
  OrganizationPermissionsApi,
  OrganizationsApi,
  OrganizationUrlsApi,
  ScreensApi,
  SectionsApi,
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
  FormUrlsApi,
  FilesApi,
]

export const exportedApis = apis.map((Api) => ({
  provide: Api,
  useFactory: (configuration: Configuration) => {
    return new Api(configuration)
  },
  inject: [ApiConfiguration.provide],
}))
