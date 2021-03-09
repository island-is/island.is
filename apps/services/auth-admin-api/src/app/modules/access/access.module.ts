import { AccessController } from './access.controller'
import { Module } from '@nestjs/common'
import { AccessService, AdminAccess } from '@island.is/auth-api-lib'
import { SequelizeModule } from '@nestjs/sequelize'

@Module({
  imports: [SequelizeModule.forFeature([AdminAccess])],
  controllers: [AccessController],
  providers: [AccessService],
})
export class AccessModule {}
