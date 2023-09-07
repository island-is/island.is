import { Module } from '@nestjs/common'
import { ApplicationController } from './application.controller'
import { ApplicationService } from './application.service'
import {
  UniversityGatewayReykjavikUniversityClientModule,
  UniversityGatewayReykjavikUniversityClientConfig,
} from '@island.is/clients/university-gateway/reykjavik-university'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [
    UniversityGatewayReykjavikUniversityClientModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [UniversityGatewayReykjavikUniversityClientConfig],
    }),
  ],
  controllers: [ApplicationController],
  providers: [ApplicationService],
})
export class ApplicationModule {}
