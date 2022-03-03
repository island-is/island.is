import { forwardRef, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { AwsS3Module,CaseModule, CourtModule } from '../index'

import { CaseFile } from './models/file.model'
import { FileController } from './file.controller'
import { FileService } from './file.service'

@Module({
  imports: [
    forwardRef(() => CaseModule),
    forwardRef(() => CourtModule),
    forwardRef(() => AwsS3Module),
    SequelizeModule.forFeature([CaseFile]),
  ],
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
