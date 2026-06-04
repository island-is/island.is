import { forwardRef, Module } from '@nestjs/common'

import { RepositoryModule } from '..'
import { InternalMessageSuspensionController } from './internalMessageSuspension.controller'
import { MessageSuspensionController } from './messageSuspension.controller'
import { MessageSuspensionService } from './messageSuspension.service'

@Module({
  imports: [forwardRef(() => RepositoryModule)],
  controllers: [MessageSuspensionController, InternalMessageSuspensionController],
  providers: [MessageSuspensionService],
  exports: [MessageSuspensionService],
})
export class MessageSuspensionModule {}
