import { Module } from '@nestjs/common'
import { EducationServiceV3 } from './educationV3.service'
import { FriggClientModule } from '@island.is/clients/mms/frigg'
import { PrimarySchoolResolver } from './resolvers/primarySchool.resolver'

@Module({
  imports: [FriggClientModule],
  providers: [PrimarySchoolResolver, EducationServiceV3],
})
export class EducationV3Module {}
