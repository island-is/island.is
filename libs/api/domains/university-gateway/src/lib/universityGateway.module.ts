import { Module } from '@nestjs/common'
import { MainResolver } from './graphql/main.resolver'
import {
  UniversityGatewayApiClientConfig,
  UniversityGatewayApiClientModule,
} from '@island.is/clients/university-gateway-api'
import { UniversityGatewayApi } from './universityGateway.service'
import { ConfigModule } from '@nestjs/config'

export
@Module({
  imports: [
    UniversityGatewayApiClientModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [UniversityGatewayApiClientConfig],
    }),
  ],
  providers: [MainResolver, UniversityGatewayApi],
  exports: [UniversityGatewayApi],
})
class UniversityGatewayApiModule {}
