import { forwardRef, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { CaseModule } from '../case/case.module'
import { DefendantModule } from '../defendant/defendant.module'
import { Defendant } from '../defendant/models/defendant.model'
import { PoliceModule } from '../police/police.module'
import { Subpoena } from './models/subpoena.model'
import { InternalSubpoenaController } from './internalSubpoena.controller'
import { SubpoenaService } from './subpoena.service'

@Module({
  imports: [
    forwardRef(() => CaseModule),
    forwardRef(() => DefendantModule),
    forwardRef(() => PoliceModule),
    SequelizeModule.forFeature([Subpoena, Defendant]),
  ],
  controllers: [InternalSubpoenaController],
  providers: [SubpoenaService],
})
export class SubpoenaModule {}
