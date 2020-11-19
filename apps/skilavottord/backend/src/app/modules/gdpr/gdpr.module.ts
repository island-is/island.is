import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { GdprService } from './gdpr.service'
import { GdprModel } from './model/gdpr.model'

@Module({
  imports: [SequelizeModule.forFeature([GdprModel])],
  providers: [GdprService],
})
export class GdprDbModule {}
