import { Module } from '@nestjs/common'
import { MainResolver } from './graphql/main.resolver'
import { SecondarySchoolApi } from './secondarySchool.service'
import {
  SecondarySchoolClientModule,
  SecondarySchoolPublicClientModule,
} from '@island.is/clients/secondary-school'

@Module({
  imports: [SecondarySchoolClientModule, SecondarySchoolPublicClientModule],
  providers: [MainResolver, SecondarySchoolApi],
  exports: [SecondarySchoolApi],
})
export class SecondarySchoolApiModule {}
