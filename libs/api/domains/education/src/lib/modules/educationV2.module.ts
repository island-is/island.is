import { Module } from '@nestjs/common'
import { GradesClientModule } from '@island.is/clients/mms/grade'
import { PrimarySchoolResolver } from '../resolvers/v2/primarySchool.resolver'
import { EducationServiceV2 } from '../services/educationV2.service'

@Module({
  imports: [GradesClientModule],
  providers: [PrimarySchoolResolver, EducationServiceV2],
})
export class EducationV2Module {}
