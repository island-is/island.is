import { Module } from '@nestjs/common'
import { MainResolver } from './graphql/main.resolver'
import { UniversityGatewayApiClientModule } from '@island.is/clients/university-gateway-api'
import { UniversityGatewayApi } from './universityGateway.service'
import { CmsModule } from '@island.is/cms'

@Module({
  imports: [UniversityGatewayApiClientModule, CmsModule],
  providers: [MainResolver, UniversityGatewayApi],
  exports: [UniversityGatewayApi],
})
export class UniversityGatewayApiModule {}
