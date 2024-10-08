import { Module } from '@nestjs/common'
import {
  ApplicationsApiProvider,
  FieldsApiProvider,
  FormApplicantProvider,
  FormsApiProvider,
  ListItemsApiProvider,
  OrganizationsApiProvider,
  ScreensApiProvider,
  SectionsApiProvider,
} from './FormSystemApiProvider'
import {
  ApplicationsApi,
  FieldsApi,
  FormApplicantsApi,
  FormsApi,
  ListItemsApi,
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
    FormApplicantProvider
  ],
  exports: [
    ApplicationsApi,
    FieldsApi,
    FormsApi,
    ListItemsApi,
    OrganizationsApi,
    ScreensApi,
    SectionsApi,
    FormApplicantsApi
  ],
})
export class FormSystemClientModule { }
