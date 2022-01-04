import { Module } from '@nestjs/common'
import { NationalRegistryXRoadModule } from '@island.is/api/domains/national-registry-x-road'
import { UserResolver } from './user.resolver'

@Module({
  imports: [NationalRegistryXRoadModule],
  providers: [UserResolver],
})
export class UserModule {}
