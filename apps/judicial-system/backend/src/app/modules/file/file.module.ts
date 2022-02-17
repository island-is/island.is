import { forwardRef, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { CourtModule } from '../index'
import { AwsS3Module } from '../aws-s3'
import { CaseModule } from '../case'
import { CaseFile } from './models'
import { FileService } from './file.service'
import { FileController } from './file.controller'

@Module({
  imports: [
    forwardRef(() => CaseModule),
    forwardRef(() => CourtModule),
    AwsS3Module,
    SequelizeModule.forFeature([CaseFile]),
  ],
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
