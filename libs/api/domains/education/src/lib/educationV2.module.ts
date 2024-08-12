import { Module } from '@nestjs/common'
import { GradesClientModule } from '@island.is/clients/mms/grade'
import { GradesResolver } from './graphql/grades.resolver'

@Module({
  imports: [GradesClientModule],
  providers: [GradesResolver],
})
export class EducationV2Module {}
