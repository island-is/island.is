import { forwardRef, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { CourtModule, AwsS3Module } from '../index'
import { CaseModule } from '../case'
import { CaseFile } from './models'
import { FileService } from './file.service'
import { FileController } from './file.controller'

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
