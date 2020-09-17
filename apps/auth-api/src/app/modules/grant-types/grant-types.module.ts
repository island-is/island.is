import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { GrantType, GrantTypeService } from '@island.is/auth-api'
import { GrantTypeController } from './grant-types.controller'

@Module({
  imports: [SequelizeModule.forFeature([GrantType])],
  controllers: [GrantTypeController],
  providers: [GrantTypeService],
})
export class GrantTypesModule {}
