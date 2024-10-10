import { forwardRef, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { CaseModule } from '../case/case.module'
import { Defendant } from '../defendant/models/defendant.model'
import { FileModule } from '../file/file.module'
import { PoliceModule } from '../police/police.module'
import { Subpoena } from './models/subpoena.model'
import { InternalSubpoenaController } from './internalSubpoena.controller'
import { LimitedAccessSubpoenaController } from './limitedAccessSubpoena.controller'
import { SubpoenaController } from './subpoena.controller'
import { SubpoenaService } from './subpoena.service'

@Module({
  imports: [
    forwardRef(() => CaseModule),
    forwardRef(() => PoliceModule),
    forwardRef(() => FileModule),
    SequelizeModule.forFeature([Subpoena, Defendant]),
  ],
  controllers: [
    SubpoenaController,
    InternalSubpoenaController,
    LimitedAccessSubpoenaController,
  ],
  providers: [SubpoenaService],
  exports: [SubpoenaService],
})
export class SubpoenaModule {}
