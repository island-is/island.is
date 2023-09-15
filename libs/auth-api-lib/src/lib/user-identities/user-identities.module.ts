import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { UserIdentity } from './models/user-identity.model'
import { Claim } from './models/claim.model'
import { UserIdentitiesService } from './user-identities.service'

@Module({
  imports: [SequelizeModule.forFeature([UserIdentity, Claim])],
  providers: [UserIdentitiesService],
  exports: [UserIdentitiesService],
})
export class UserIdentitiesModule {}
