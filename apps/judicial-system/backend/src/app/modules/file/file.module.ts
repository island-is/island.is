import { forwardRef, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { CmsTranslationsModule } from '@island.is/cms-translations'

import { MessageModule } from '@island.is/judicial-system/message'

import { CaseFile } from '../repository'
import { AwsS3Module, CaseModule, CourtModule, UserModule } from '..'
import { CriminalRecordModule } from './criminalRecord.module'
import { FileController } from './file.controller'
import { FileService } from './file.service'
import { InternalFileController } from './internalFile.controller'
import { LimitedAccessFileController } from './limitedAccessFile.controller'

@Module({
  imports: [
    CmsTranslationsModule,
    MessageModule,
    CriminalRecordModule,
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
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
