import { AccessController } from './access.controller'
import { Module } from '@nestjs/common'
import { ResourcesModule } from '@island.is/auth-api-lib'

@Module({
  imports: [ResourcesModule],
  controllers: [AccessController],
  providers: [],
})
export class AccessModule {}
