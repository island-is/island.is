import { Global, Module } from '@nestjs/common'
import { PubsubProvider } from './pubsub.provider'
import { PubSubService } from './pubsub.service'

@Global()
@Module({
  providers: [PubsubProvider, PubSubService],
  exports: [PubsubProvider, PubSubService],
})
export class PubSubModule {}
