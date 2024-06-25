import { Module } from '@nestjs/common'
import {
  FilesApiProvider,
  FormsApiProvider,
  GroupsApiProvider,
  InputsApiProvider,
  OrganizationsApiProvider,
  ServicesApiProvider,
  StepsApiProvider,
} from './FormSystemApiProvider'
import {
  FilesApi,
  FormsApi,
  GroupsApi,
  InputsApi,
  OrganizationsApi,
  ServicesApi,
  StepsApi,
} from '../../gen/fetch'

@Module({
  controllers: [],
  providers: [
    FilesApiProvider,
    FormsApiProvider,
    GroupsApiProvider,
    InputsApiProvider,
    OrganizationsApiProvider,
    ServicesApiProvider,
    StepsApiProvider,
  ],
  exports: [
    FilesApi,
    FormsApi,
    GroupsApi,
    InputsApi,
    OrganizationsApi,
    ServicesApi,
    StepsApi,
  ],
})
export class FormSystemClientModule {}
