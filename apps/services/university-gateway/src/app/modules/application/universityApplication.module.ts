import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { UniversityApplicationController } from './universityApplication.controller'
import { UniversityApplicationService } from './universityApplication.service'
import { Application } from './model/application'
import { ProgramModeOfDelivery } from '../program/model/programModeOfDelivery'
import { Program } from '../program/model/program'
import { University } from '../university/model/university'
import { ReykjavikUniversityApplicationClientModule } from '@island.is/clients/university-application/reykjavik-university'
import { UniversityOfIcelandApplicationClientModule } from '@island.is/clients/university-application/university-of-iceland'
import { UniversityOfAkureyriApplicationClientModule } from '@island.is/clients/university-application/university-of-akureyri'
import { BifrostUniversityApplicationClientModule } from '@island.is/clients/university-application/bifrost-university'
import { IcelandUniversityOfTheArtsApplicationClientModule } from '@island.is/clients/university-application/iceland-university-of-the-arts'
import { AgriculturalUniversityOfIcelandApplicationClientModule } from '@island.is/clients/university-application/agricultural-university-of-iceland'
import { HolarUniversityApplicationClientModule } from '@island.is/clients/university-application/holar-university'

@Module({
  imports: [
    SequelizeModule.forFeature([
      Application,
      ProgramModeOfDelivery,
      Program,
      University,
    ]),
    ReykjavikUniversityApplicationClientModule,
    UniversityOfIcelandApplicationClientModule,
    UniversityOfAkureyriApplicationClientModule,
    BifrostUniversityApplicationClientModule,
    IcelandUniversityOfTheArtsApplicationClientModule,
    AgriculturalUniversityOfIcelandApplicationClientModule,
    HolarUniversityApplicationClientModule,
  ],
  controllers: [UniversityApplicationController],
  providers: [UniversityApplicationService],
})
export class UniversityApplicationModule {}
