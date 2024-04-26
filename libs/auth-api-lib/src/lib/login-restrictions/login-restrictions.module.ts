import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { LoginRestriction } from './login-restriction.model'
import { LoginRestrictionsService } from './login-restrictions.service'

@Module({
  imports: [SequelizeModule.forFeature([LoginRestriction])],
  providers: [LoginRestrictionsService],
  exports: [LoginRestrictionsService],
})
export class LoginRestrictionsModule {}
