import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { GrantType } from './models/grant-type.model'
import { GrantTypeService } from './grant-type.service'

@Module({
  imports: [SequelizeModule.forFeature([GrantType])],
  providers: [GrantTypeService],
  exports: [GrantTypeService],
})
export class GrantTypeModule {}
