import { forwardRef, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { CmsTranslationsModule } from '@island.is/cms-translations'

import { CaseModule, UserModule, CourtModule, AwsS3Module } from '../index'
import { CaseFile } from './models/file.model'
import { FileService } from './file.service'
import { FileController } from './file.controller'
import { InternalFileController } from './internalFile.controller'
import { LimitedAccessFileController } from './limitedAccessFile.controller'

@Module({
  imports: [
    CmsTranslationsModule,
    forwardRef(() => CaseModule),
    forwardRef(() => UserModule),
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
