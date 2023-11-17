import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { SequelizeConfigService } from '../sequelizeConfig.service'
import { ConfigModule } from '@nestjs/config'
import { IdsClientConfig, XRoadConfig } from '@island.is/nest/config'
import {
  ReykjavikUniversityApplicationClientConfig,
  ReykjavikUniversityApplicationClientModule,
} from '@island.is/clients/university-application/reykjavik-university'
import {
  UniversityOfIcelandApplicationClientConfig,
  UniversityOfIcelandApplicationClientModule,
} from '@island.is/clients/university-application/university-of-iceland'
import { UniversityGatewayWorkerService } from './worker.service'
import { AuditModule } from '@island.is/nest/audit'
import { environment } from '../../environments'
import { InternalProgramService } from '../modules/program/internalProgram.service'
import { InternalCourseService } from '../modules/course/internalCourse.service'
import { InternalApplicationService } from '../modules/application/internalApplication.service'
import { University } from '../modules/university/model/university'
import { Course } from '../modules/course/model/course'
import { Tag } from '../modules/program/model/tag'
import { ProgramCourse } from '../modules/program/model/programCourse'
import { ProgramModeOfDelivery } from '../modules/program/model/programModeOfDelivery'
import { Program } from '../modules/program/model/program'
import { ProgramTag } from '../modules/program/model/programTag'
import { ProgramExtraApplicationField } from '../modules/program/model/programExtraApplicationField'
import { LoggingModule } from '@island.is/logging'

@Module({
  imports: [
    AuditModule.forRoot(environment.audit),
    LoggingModule,
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    SequelizeModule.forFeature([
      University,
      Course,
      Tag,
      Program,
      ProgramTag,
      ProgramModeOfDelivery,
      ProgramExtraApplicationField,
      ProgramCourse,
    ]),
    ReykjavikUniversityApplicationClientModule,
    UniversityOfIcelandApplicationClientModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        IdsClientConfig,
        XRoadConfig,
        ReykjavikUniversityApplicationClientConfig,
        UniversityOfIcelandApplicationClientConfig,
      ],
    }),
  ],
  providers: [
    InternalProgramService,
    InternalCourseService,
    InternalApplicationService,
    UniversityGatewayWorkerService,
  ],
})
export class UniversityGatewayWorkerModule {}
