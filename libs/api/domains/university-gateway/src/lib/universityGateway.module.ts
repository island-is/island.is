import { Module } from '@nestjs/common'
import { MainResolver } from './graphql/main.resolver'
import { UniversityGatewayApiClientModule } from '@island.is/clients/university-gateway-api'
import { UniversityGatewayApi } from './universityGateway.service'

export
@Module({
  imports: [UniversityGatewayApiClientModule],
  providers: [MainResolver, UniversityGatewayApi],
  exports: [UniversityGatewayApi],
})
class TransportAuthorityApiModule {}
