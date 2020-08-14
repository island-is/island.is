import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { UserIdentity } from './user-identity.model'
import { UserIdentityController } from './user-identity.controller'
import { UserIdentityService } from './user-identity.service'

@Module({
  imports: [SequelizeModule.forFeature([UserIdentity])],
  controllers: [UserIdentityController],
  providers: [UserIdentityService],
})
export class UserIdentityModule {}
