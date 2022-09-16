import { Module } from '@nestjs/common'
import { ResourcesController } from './resources.controller'
import { ResourcesModule as AuthResourcesModule } from '@island.is/auth-api-lib'

@Module({
  imports: [AuthResourcesModule],
  controllers: [ResourcesController],
  providers: [],
})
export class ResourcesModule {}
