import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { Verdict } from './models/verdict.model'
import { VerdictController } from './verdict.controller'
import { VerdictService } from './verdict.service'

@Module({
  imports: [SequelizeModule.forFeature([Verdict])],
  controllers: [VerdictController],
  providers: [VerdictService],
  exports: [VerdictService],
})
export class VerdictModule {}
