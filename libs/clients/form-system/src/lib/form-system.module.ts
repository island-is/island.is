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
  OrganizationCertificationsProvider,
} from './FormSystemApiProvider'
import {
  ApplicationsApi,
  FieldsApi,
  FormApplicantTypesApi,
  FormCertificationTypesApi,
  FormsApi,
  ListItemsApi,
  OrganizationCertificationTypesApi,
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
    OrganizationCertificationsProvider,
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
    OrganizationCertificationTypesApi,
  ],
})
export class FormSystemClientModule {}
