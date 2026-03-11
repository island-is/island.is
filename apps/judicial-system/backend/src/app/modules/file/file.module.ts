import { forwardRef, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { CmsTranslationsModule } from '@island.is/cms-translations'

import { CaseFile } from '../repository'
import {
  AwsS3Module,
  CaseModule,
  CourtModule,
  CriminalRecordModule,
  RepositoryModule,
  UserModule,
} from '..'
import { FileController } from './file.controller'
import { FileService } from './file.service'
import { InternalFileController } from './internalFile.controller'
import { LimitedAccessFileController } from './limitedAccessFile.controller'
import { PoliceDigitalCaseFileService } from './policeDigitalCaseFile.service'

@Module({
  imports: [
    CmsTranslationsModule,
    forwardRef(() => CriminalRecordModule),
    forwardRef(() => RepositoryModule),
    forwardRef(() => UserModule),
    forwardRef(() => CaseModule),
    forwardRef(() => CourtModule),
    forwardRef(() => AwsS3Module),
    SequelizeModule.forFeature([CaseFile]),
  ],
  controllers: [
    FileController,
    InternalFileController,
    LimitedAccessFileController,
  ],
  providers: [FileService, PoliceDigitalCaseFileService],
  exports: [FileService, PoliceDigitalCaseFileService],
})
export class FileModule {}
