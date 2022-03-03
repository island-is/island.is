import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { Grant, GrantsService } from '@island.is/auth-api-lib'

import { GrantsController } from './grants.controller'

@Module({
  imports: [SequelizeModule.forFeature([Grant])],
  controllers: [GrantsController],
  providers: [GrantsService],
})
export class GrantsModule {}
