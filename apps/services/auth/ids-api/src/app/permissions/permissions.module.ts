import { Module } from '@nestjs/common'
import { ResourcesModule } from '@island.is/auth-api-lib'
import { PermissionsController } from './permissions.controller'

@Module({
  imports: [ResourcesModule],
  controllers: [PermissionsController],
  providers: [],
})
export class PermissionsModule {}
