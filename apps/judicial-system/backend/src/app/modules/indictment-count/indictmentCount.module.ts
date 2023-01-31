import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { IndictmentCount } from './models/indictmentCount.model'
import { IndictmentCountService } from './indictmentCount.service'
import { IndictmentCountController } from './indictmentCount.controller'

@Module({
  imports: [SequelizeModule.forFeature([IndictmentCount])],
  controllers: [IndictmentCountController],
  providers: [IndictmentCountService],
})
export class IndictmentCountModule {}
