import { forwardRef, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { IndictmentCount, Offense } from '../repository'
import { CaseModule } from '..'
import { IndictmentCountController } from './indictmentCount.controller'
import { IndictmentCountService } from './indictmentCount.service'
import { IndictmentCountsController } from './indictmentCounts.controller'

@Module({
  imports: [
    forwardRef(() => CaseModule),
    SequelizeModule.forFeature([IndictmentCount, Offense]),
  ],
  controllers: [IndictmentCountController, IndictmentCountsController],
  providers: [IndictmentCountService],
  exports: [IndictmentCountService],
})
export class IndictmentCountModule {}
