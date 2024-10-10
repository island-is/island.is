import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SharedTemplateAPIModule } from '../../shared'
import { UniversityService } from './university.service'
import { NationalRegistryClientModule } from '@island.is/clients/national-registry-v2'
import {
  UniversityGatewayApiClientConfig,
  UniversityGatewayApiClientModule,
} from '@island.is/clients/university-gateway-api'
import { InnaClientModule } from '@island.is/clients/inna'

@Module({
  imports: [
    SharedTemplateAPIModule,
    NationalRegistryClientModule,
    InnaClientModule,
    UniversityGatewayApiClientModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [UniversityGatewayApiClientConfig],
    }),
  ],
  providers: [UniversityService],
  exports: [UniversityService],
})
export class UniversityModule {}
