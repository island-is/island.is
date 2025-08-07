import { forwardRef, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { CmsTranslationsModule } from '@island.is/cms-translations'
import { SigningModule } from '@island.is/dokobit-signing'

import { MessageModule } from '@island.is/judicial-system/message'

import { Case, DateLog } from '../case'
import { CaseArchive } from '../case/models/caseArchive.model'
import { CaseString } from '../case/models/caseString.model'
import {
  AwsS3Module,
  CourtModule,
  DefendantModule,
  EventLogModule,
  EventModule,
  FileModule,
  IndictmentCountModule,
  PoliceModule,
  SubpoenaModule,
  UserModule,
  VictimModule,
} from '../index'
import { Subpoena } from '../subpoena'
import { StatisticsController } from './statistics.controller'
import { StatisticsService } from './statistics.service'

@Module({
  imports: [
    SigningModule,
    CmsTranslationsModule,
    MessageModule,
    forwardRef(() => DefendantModule),
    forwardRef(() => SubpoenaModule),
    forwardRef(() => UserModule),
    forwardRef(() => FileModule),
    forwardRef(() => IndictmentCountModule),
    forwardRef(() => CourtModule),
    forwardRef(() => AwsS3Module),
    forwardRef(() => EventModule),
    forwardRef(() => PoliceModule),
    forwardRef(() => EventLogModule),
    forwardRef(() => VictimModule),
    SequelizeModule.forFeature([
      Case,
      Subpoena,
      CaseArchive,
      DateLog,
      CaseString,
    ]),
  ],
  providers: [StatisticsService],
  controllers: [StatisticsController],
})
export class StatisticsModule {}
