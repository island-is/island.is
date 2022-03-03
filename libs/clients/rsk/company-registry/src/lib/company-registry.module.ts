import { Module } from '@nestjs/common'

import { GetCompanyApiProvider } from './GetCompanyApiProvider'
import { SearchCompanyRegistryApiProvider } from './SearchCompanyRegistryApiProvider'
import { ServiceInformationApiProvider } from './ServiceInformationApiProvider'

@Module({
  providers: [
    GetCompanyApiProvider,
    SearchCompanyRegistryApiProvider,
    ServiceInformationApiProvider,
  ],
  exports: [
    GetCompanyApiProvider,
    SearchCompanyRegistryApiProvider,
    ServiceInformationApiProvider,
  ],
})
export class CompanyRegistryClientModule {}
