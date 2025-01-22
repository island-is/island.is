import { Module } from '@nestjs/common'
import { MainResolver } from './graphql/main.resolver'
import { SecondarySchoolApi } from './secondarySchool.service'
import { SecondarySchoolClientModule } from '@island.is/clients/secondary-school'

@Module({
  imports: [SecondarySchoolClientModule],
  providers: [MainResolver, SecondarySchoolApi],
  exports: [SecondarySchoolApi],
})
export class SecondarySchoolApiModule {}
