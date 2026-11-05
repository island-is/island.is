import { forwardRef, Module } from '@nestjs/common'

import { EmailModule } from '@island.is/email-service'

import { RepositoryModule } from '../repository/repository.module'
import {
  AwsS3Module,
  CaseModule,
  EventModule,
  IndictmentCountModule,
  SubpoenaModule,
} from '..'
import { PoliceController } from './police.controller'
import { PoliceService } from './police.service'

@Module({
  imports: [
    EmailModule,
    forwardRef(() => CaseModule),
    forwardRef(() => EventModule),
    forwardRef(() => AwsS3Module),
    forwardRef(() => SubpoenaModule),
    forwardRef(() => IndictmentCountModule),
    RepositoryModule,
  ],
  controllers: [PoliceController],
  providers: [PoliceService],
  exports: [PoliceService],
})
export class PoliceModule {}
