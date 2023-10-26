import { Module } from '@nestjs/common'
import { ProgramController } from './program.controller'
import { ProgramService } from './program.service'
import { InternalProgramController } from './internalProgram.controller'
import { InternalProgramService } from './internalProgram.service'
import { SequelizeModule } from '@nestjs/sequelize'
import {
  ProgramExtraApplicationField,
  ProgramModeOfDelivery,
  ProgramTable,
  ProgramTag,
  Tag,
} from './model'
import { Course } from '../course/model'
import { University } from '../university/model'
import {
  ReykjavikUniversityApplicationClientConfig,
  ReykjavikUniversityApplicationClientModule,
} from '@island.is/clients/university-application/reykjavik-university'
import {
  UniversityOfIcelandApplicationClientConfig,
  UniversityOfIcelandApplicationClientModule,
} from '@island.is/clients/university-application/university-of-iceland'
import { ConfigModule } from '@nestjs/config'
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
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        ReykjavikUniversityApplicationClientConfig,
        UniversityOfIcelandApplicationClientConfig,
      ],
    }),
  ],
  controllers: [InternalProgramController, ProgramController],
  providers: [InternalProgramService, ProgramService],
})
export class ProgramModule {}
