import { AccessController } from './access.controller'
import { Module } from '@nestjs/common'
import {
  AccessService,
  ApiScopeUser,
  ApiScopeUserAccess,
} from '@island.is/auth-api-lib'
import { SequelizeModule } from '@nestjs/sequelize'

@Module({
  imports: [SequelizeModule.forFeature([ApiScopeUser, ApiScopeUserAccess])],
  controllers: [AccessController],
  providers: [AccessService],
})
export class AccessModule {}
