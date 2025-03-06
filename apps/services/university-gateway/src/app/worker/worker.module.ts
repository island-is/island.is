import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { SequelizeConfigService } from '../../sequelizeConfig.service'
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
import {
  UniversityOfAkureyriApplicationClientConfig,
  UniversityOfAkureyriApplicationClientModule,
} from '@island.is/clients/university-application/university-of-akureyri'
import {
  BifrostUniversityApplicationClientConfig,
  BifrostUniversityApplicationClientModule,
} from '@island.is/clients/university-application/bifrost-university'
import {
  IcelandUniversityOfTheArtsApplicationClientConfig,
  IcelandUniversityOfTheArtsApplicationClientModule,
} from '@island.is/clients/university-application/iceland-university-of-the-arts'
import {
  AgriculturalUniversityOfIcelandApplicationClientConfig,
  AgriculturalUniversityOfIcelandApplicationClientModule,
} from '@island.is/clients/university-application/agricultural-university-of-iceland'
import {
  HolarUniversityApplicationClientConfig,
  HolarUniversityApplicationClientModule,
} from '@island.is/clients/university-application/holar-university'
import { UniversityGatewayWorkerService } from './worker.service'
import { AuditModule, AuditConfig } from '@island.is/nest/audit'
import { InternalProgramService } from '../modules/program/internalProgram.service'
import { InternalApplicationService } from '../modules/application/internalApplication.service'
import { University } from '../modules/university/model/university'
import { ProgramModeOfDelivery } from '../modules/program/model/programModeOfDelivery'
import { Program } from '../modules/program/model/program'
import { ProgramExtraApplicationField } from '../modules/program/model/programExtraApplicationField'
import { LoggingModule } from '@island.is/logging'
import { UniversityApplicationService } from '../modules/application/universityApplication.service'
import { UniversityApplicationModule } from '../modules/application/universityApplication.module'
import { Application } from '../modules/application/model/application'

@Module({
  imports: [
    AuditModule,
    LoggingModule,
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    SequelizeModule.forFeature([
      University,
      Program,
      ProgramModeOfDelivery,
      ProgramExtraApplicationField,
      Application,
    ]),
    ReykjavikUniversityApplicationClientModule,
    UniversityOfIcelandApplicationClientModule,
    UniversityOfAkureyriApplicationClientModule,
    BifrostUniversityApplicationClientModule,
    IcelandUniversityOfTheArtsApplicationClientModule,
    AgriculturalUniversityOfIcelandApplicationClientModule,
    HolarUniversityApplicationClientModule,
    UniversityApplicationModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        IdsClientConfig,
        XRoadConfig,
        ReykjavikUniversityApplicationClientConfig,
        UniversityOfIcelandApplicationClientConfig,
        UniversityOfAkureyriApplicationClientConfig,
        BifrostUniversityApplicationClientConfig,
        IcelandUniversityOfTheArtsApplicationClientConfig,
        AgriculturalUniversityOfIcelandApplicationClientConfig,
        HolarUniversityApplicationClientConfig,
        AuditConfig
      ],
    }),
  ],
  providers: [
    InternalProgramService,
    InternalApplicationService,
    UniversityGatewayWorkerService,
    UniversityApplicationService,
  ],
})
export class UniversityGatewayWorkerModule {}
