import { Module } from '@nestjs/common'
import { ProgramController } from './program.controller'
import { ProgramService } from './program.service'
import { InternalProgramController } from './internalProgram.controller'
import { InternalProgramService } from './internalProgram.service'
import { SequelizeModule } from '@nestjs/sequelize'
import { Tag } from './model/tag'
import { ProgramTable } from './model/program'
import { ProgramTag } from './model/programTag'
import { ProgramModeOfDelivery } from './model/programModeOfDelivery'
import { ProgramExtraApplicationField } from './model/programExtraApplicationField'
import { Course } from '../course'
import { University } from '../university'
import { ReykjavikUniversityApplicationClientModule } from '@island.is/clients/university-application/reykjavik-university'
import { UniversityOfIcelandApplicationClientModule } from '@island.is/clients/university-application/university-of-iceland'
import { AuditModule } from '@island.is/nest/audit'
import { environment } from '../../../environments'

@Module({
  imports: [
    AuditModule.forRoot(environment.audit),
    SequelizeModule.forFeature([
      University,
      Course,
      Tag,
      ProgramTable,
      ProgramTag,
      ProgramModeOfDelivery,
      ProgramExtraApplicationField,
    ]),
    ReykjavikUniversityApplicationClientModule,
    UniversityOfIcelandApplicationClientModule,
  ],
  controllers: [InternalProgramController, ProgramController],
  providers: [InternalProgramService, ProgramService],
})
export class ProgramModule {}
