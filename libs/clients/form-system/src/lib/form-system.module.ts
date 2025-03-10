import { Module } from '@nestjs/common'
import {
  ApplicationsApiProvider,
  CertificationsProvider,
  FieldsApiProvider,
  FormApplicantProvider,
  FormsApiProvider,
  ListItemsApiProvider,
  OrganizationsApiProvider,
  ScreensApiProvider,
  SectionsApiProvider,
  OrganizationPermissionsProvider,
} from './FormSystemApiProvider'
import {
  ApplicationsApi,
  FieldsApi,
  FormApplicantTypesApi,
  FormCertificationTypesApi,
  FormsApi,
  ListItemsApi,
  OrganizationPermissionsApi,
  OrganizationsApi,
  ScreensApi,
  SectionsApi,
} from '../../gen/fetch'

@Module({
  controllers: [],
  providers: [
    ApplicationsApiProvider,
    FieldsApiProvider,
    FormsApiProvider,
    ListItemsApiProvider,
    OrganizationsApiProvider,
    ScreensApiProvider,
    SectionsApiProvider,
    FormApplicantProvider,
    CertificationsProvider,
    OrganizationPermissionsProvider,
  ],
  exports: [
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
  ],
})
export class FormSystemClientModule {}
