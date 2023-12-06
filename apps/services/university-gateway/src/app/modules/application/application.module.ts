import { Module } from '@nestjs/common'
import { ApplicationController } from './application.controller'
import { ApplicationService } from './application.service'
import { ReykjavikUniversityApplicationClientModule } from '@island.is/clients/university-application/reykjavik-university'
import { UniversityOfIcelandApplicationClientModule } from '@island.is/clients/university-application/university-of-iceland'

@Module({
  imports: [
    ReykjavikUniversityApplicationClientModule,
    UniversityOfIcelandApplicationClientModule,
  ],
  controllers: [ApplicationController],
  providers: [ApplicationService],
})
export class ApplicationModule {}
