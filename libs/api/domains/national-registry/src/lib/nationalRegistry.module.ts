import { Module } from '@nestjs/common'

import { NationalRegistryService } from './nationalRegistry.service'
import { NationalRegistryV3ClientModule } from '@island.is/clients/national-registry-v3'
import { BrokerService } from './v3/broker.service'
import {
  UserResolver,
  ChildResolver,
  PersonResolver,
  ChildCustodyResolver,
} from './resolvers'

@Module({
  imports: [NationalRegistryV3ClientModule],
  providers: [
    BrokerService,
    NationalRegistryService,
    UserResolver,
    ChildCustodyResolver,
    PersonResolver,
    ChildResolver,
  ],
})
export class NationalRegistryModule {}
