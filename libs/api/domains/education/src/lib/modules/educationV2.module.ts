import { Module } from '@nestjs/common'
import { GradesClientModule } from '@island.is/clients/mms/grade'
import { GradesResolver } from '../resolvers/v2/grades.resolver'
import { EducationServiceV2 } from '../services/educationV2.service'

@Module({
  imports: [GradesClientModule],
  providers: [GradesResolver, EducationServiceV2],
})
export class EducationV2Module {}
