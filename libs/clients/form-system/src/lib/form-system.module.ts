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
  ValuesProvider,
} from './FormSystemApiProvider'
import {
  ApplicationsApi,
  FieldsApi,
  FormApplicantTypesApi,
  FormCertificationTypesApi,
  FormsApi,
  ListItemsApi,
  OrganizationsApi,
  ScreensApi,
  SectionsApi,
  ValuesApi,
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
    ValuesProvider,
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
    ValuesApi,
  ],
})
export class FormSystemClientModule {}
