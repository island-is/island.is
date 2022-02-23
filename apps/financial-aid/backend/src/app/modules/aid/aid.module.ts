import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { AidModel } from './models'
import { AidService } from './aid.service'

@Module({
  imports: [SequelizeModule.forFeature([AidModel])],
  providers: [AidService],
  exports: [AidService],
})
export class AidModule {}
