import { Module } from '@nestjs/common'
import { ApplicationResolver } from './application.resolver'
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
  providers: [ApplicationResolver],
})
export class ApplicationModule {}
