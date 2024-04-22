import { forwardRef, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { CmsTranslationsModule } from '@island.is/cms-translations'

import { MessageModule } from '@island.is/judicial-system/message'

import { AwsS3Module } from '../aws-s3/awsS3.module'
import { CaseModule, CourtModule } from '../index'
import { CaseFile } from './models/file.model'
import { FileController } from './file.controller'
import { FileService } from './file.service'
import { InternalFileController } from './internalFile.controller'
import { LimitedAccessFileController } from './limitedAccessFile.controller'

@Module({
  imports: [
    CmsTranslationsModule,
    MessageModule,
    AwsS3Module,
    forwardRef(() => CaseModule),
    forwardRef(() => CourtModule),
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
