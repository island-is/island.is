import { Module } from '@nestjs/common'
import { UniversityGatewayUniversityOfIcelandClient } from './universityOfIcelandClient.service'
import { exportedApis } from './apiConfiguration'

@Module({
  providers: [...exportedApis, UniversityGatewayUniversityOfIcelandClient],
  exports: [UniversityGatewayUniversityOfIcelandClient],
})
export class UniversityGatewayUniversityOfIcelandClientModule {}
