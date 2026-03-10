import { Module } from '@nestjs/common'
import { PrimarySchoolClientModule } from '@island.is/clients/mms/primary-school'
import { PrimarySchoolResolver } from '../resolvers/primarySchool.resolver'

@Module({
  imports: [PrimarySchoolClientModule],
  providers: [PrimarySchoolResolver],
})
export class PrimarySchoolModule {}
