import { forwardRef, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { CaseModule } from '../case/case.module'
import { IndictmentCount } from './models/indictmentCount.model'
import { IndictmentCountService } from './indictmentCount.service'
import { IndictmentCountController } from './indictmentCount.controller'

@Module({
  imports: [
    forwardRef(() => CaseModule),
    SequelizeModule.forFeature([IndictmentCount]),
  ],
  controllers: [IndictmentCountController],
  providers: [IndictmentCountService],
})
export class IndictmentCountModule {}
