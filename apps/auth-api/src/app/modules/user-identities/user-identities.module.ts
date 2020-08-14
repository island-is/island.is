import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { UserIdentity } from './user-identity.model'
import { UserIdentitiesController } from './user-identities.controller'
import { UserIdentitiesService } from './user-identities.service'
import { Claim } from './claim.model'

@Module({
  imports: [SequelizeModule.forFeature([Claim, UserIdentity])],
  controllers: [UserIdentitiesController],
  providers: [UserIdentitiesService],
})
export class UserIdentitiesModule {}
