import { Module } from '@nestjs/common'
import {
  ApplicationsApiProvider,
  FieldsApiProvider,
  FormsApiProvider,
  ListItemsApiProvider,
  OrganizationsApiProvider,
  ScreensApiProvider,
  SectionsApiProvider,
} from './FormSystemApiProvider'
import {
  ApplicationsApi,
  FieldsApi,
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
  ],
  exports: [
    ApplicationsApi,
    FieldsApi,
    FormsApi,
    ListItemsApi,
    OrganizationsApi,
    ScreensApi,
    SectionsApi,
  ],
})
export class FormSystemClientModule {}
