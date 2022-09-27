import { GrantsController } from './grants.controller'
import { Module } from '@nestjs/common'
import { Grant, GrantsService } from '@island.is/auth-api-lib'
import { SequelizeModule } from '@nestjs/sequelize'

@Module({
  imports: [SequelizeModule.forFeature([Grant])],
  controllers: [GrantsController],
  providers: [GrantsService],
})
export class GrantsModule {}
