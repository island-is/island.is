import { forwardRef, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { CaseModule } from '../case/case.module'
import { IndictmentCount } from './models/indictmentCount.model'
import { IndictmentCountController } from './indictmentCount.controller'
import { IndictmentCountService } from './indictmentCount.service'

@Module({
  imports: [
    forwardRef(() => CaseModule),
    SequelizeModule.forFeature([IndictmentCount]),
  ],
  controllers: [IndictmentCountController],
  providers: [IndictmentCountService],
  exports: [IndictmentCountService],
})
export class IndictmentCountModule {}
