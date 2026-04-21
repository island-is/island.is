import { forwardRef, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { IndictmentSubtype } from '../repository'
import { RepositoryModule } from '../repository/repository.module'
import { AwsS3Module, CaseModule, EventModule, SubpoenaModule } from '..'
import { PoliceController } from './police.controller'
import { PoliceService } from './police.service'

@Module({
  imports: [
    forwardRef(() => CaseModule),
    forwardRef(() => EventModule),
    forwardRef(() => AwsS3Module),
    forwardRef(() => SubpoenaModule),
    RepositoryModule,
    SequelizeModule.forFeature([IndictmentSubtype]),
  ],
  controllers: [PoliceController],
  providers: [PoliceService],
  exports: [PoliceService],
})
export class PoliceModule {}
