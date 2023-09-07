import { Module } from '@nestjs/common'
import { ProgramController } from './program.controller'
import { ProgramService } from './program.service'
import { InternalProgramController } from './internalProgram.controller'
import { InternalProgramService } from './internalProgram.service'
import { SequelizeModule } from '@nestjs/sequelize'
import {
  Program,
  ProgramExtraApplicationField,
  ProgramModeOfDelivery,
  ProgramTag,
  Tag,
} from './model'
import { Course } from '../course/model'
import { University } from '../university/model'
import {
  UniversityGatewayReykjavikUniversityClientConfig,
  UniversityGatewayReykjavikUniversityClientModule,
} from '@island.is/clients/university-gateway/reykjavik-university'
import {
  UniversityGatewayUniversityOfIcelandClientConfig,
  UniversityGatewayUniversityOfIcelandClientModule,
} from '@island.is/clients/university-gateway/university-of-iceland'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [
    SequelizeModule.forFeature([
      University,
      Course,
      Tag,
      Program,
      ProgramTag,
      ProgramModeOfDelivery,
      ProgramExtraApplicationField,
    ]),
    UniversityGatewayReykjavikUniversityClientModule,
    UniversityGatewayUniversityOfIcelandClientModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        UniversityGatewayReykjavikUniversityClientConfig,
        UniversityGatewayUniversityOfIcelandClientConfig,
      ],
    }),
  ],
  controllers: [InternalProgramController, ProgramController],
  providers: [InternalProgramService, ProgramService],
})
export class ProgramModule {}
