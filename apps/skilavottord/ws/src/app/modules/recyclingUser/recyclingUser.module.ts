import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { RecyclingUserModel } from './recyclingUser.model'
import { RecyclingUserService } from './recyclingUser.service'

@Module({})
export class RecyclingUserModule {}

@Module({
  imports: [SequelizeModule.forFeature([RecyclingUserModel])],
  providers: [RecyclingUserService],
  exports: [RecyclingUserService],
})
export class RecyclingPartnerModule {}
