import { Module } from '@nestjs/common'
import { ApplicationController } from './application.controller'
import { ApplicationService } from './application.service'
import { ReykjavikUniversityApplicationClientModule } from '@island.is/clients/university-application/reykjavik-university'
import { UniversityOfIcelandApplicationClientModule } from '@island.is/clients/university-application/university-of-iceland'
import { UniversityOfAkureyriApplicationClientModule } from '@island.is/clients/university-application/university-of-akureyri'
import { BifrostUniversityApplicationClientModule } from '@island.is/clients/university-application/bifrost-university'
import { IcelandUniversityOfTheArtsApplicationClientModule } from '@island.is/clients/university-application/iceland-university-of-the-arts'
import { AgriculturalUniversityOfIcelandApplicationClientModule } from '@island.is/clients/university-application/agricultural-university-of-iceland'
import { HolarUniversityApplicationClientModule } from '@island.is/clients/university-application/holar-university'

@Module({
  imports: [
    ReykjavikUniversityApplicationClientModule,
    UniversityOfIcelandApplicationClientModule,
    UniversityOfAkureyriApplicationClientModule,
    BifrostUniversityApplicationClientModule,
    IcelandUniversityOfTheArtsApplicationClientModule,
    AgriculturalUniversityOfIcelandApplicationClientModule,
    HolarUniversityApplicationClientModule,
  ],
  controllers: [ApplicationController],
  providers: [ApplicationService],
})
export class ApplicationModule {}
