import { forwardRef, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { AwsS3Module } from '../aws-s3'
import { CourtModule } from '../court'
import { CaseModule } from '../case'
import { CaseFile } from './models'
import { FileService } from './file.service'
import { FileController } from './file.controller'

@Module({
  imports: [
    forwardRef(() => CaseModule),
    CourtModule,
    AwsS3Module,
    SequelizeModule.forFeature([CaseFile]),
  ],
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
