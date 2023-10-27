import { Module } from '@nestjs/common'
import { MainResolver } from './graphql/main.resolver'
import {
  UniversityGatewayApiClientConfig,
  UniversityGatewayApiClientModule,
} from '@island.is/clients/university-gateway-api'
import { UniversityGatewayApi } from './universityGateway.service'
import { ConfigModule } from '@nestjs/config'
import { CmsModule } from '@island.is/cms'

@Module({
  imports: [
    UniversityGatewayApiClientModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [UniversityGatewayApiClientConfig],
    }),
    CmsModule,
  ],
  providers: [MainResolver, UniversityGatewayApi],
  exports: [UniversityGatewayApi],
})
export class UniversityGatewayApiModule {}
