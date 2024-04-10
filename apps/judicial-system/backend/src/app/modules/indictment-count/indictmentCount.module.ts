import { forwardRef, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { CaseModule } from '../case/case.module'
import { DateLogModule } from '../date-log/dateLog.module'
import { IndictmentCount } from './models/indictmentCount.model'
import { IndictmentCountController } from './indictmentCount.controller'
import { IndictmentCountService } from './indictmentCount.service'

@Module({
  imports: [
    forwardRef(() => CaseModule),
    forwardRef(() => DateLogModule),
    SequelizeModule.forFeature([IndictmentCount]),
  ],
  controllers: [IndictmentCountController],
  providers: [IndictmentCountService],
  exports: [IndictmentCountService],
})
export class IndictmentCountModule {}
