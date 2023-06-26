import { GrantsController } from './grants.controller'
import { Module } from '@nestjs/common'
import { GrantsModule as AuthGrantsModule } from '@island.is/auth-api-lib'

@Module({
  imports: [AuthGrantsModule],
  controllers: [GrantsController],
  providers: [],
})
export class GrantsModule {}
