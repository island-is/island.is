import { Module } from '@nestjs/common'

import { MessageSuspensionResolver } from './messageSuspension.resolver'

@Module({
  providers: [MessageSuspensionResolver],
})
export class MessageSuspensionModule {}
