import { Module } from '@nestjs/common'
import { GrantTypeModule } from '@island.is/auth-api-lib'
import { GrantTypeController } from './grant-types.controller'

@Module({
  imports: [GrantTypeModule],
  controllers: [GrantTypeController],
  providers: [],
})
export class GrantTypesModule {}
