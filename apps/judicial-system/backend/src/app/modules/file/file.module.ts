import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { CaseModule } from '../case'
import { CourtModule } from '../court'
import { FileController } from './file.controller'
import { FileService } from './file.service'
import { AwsS3Service } from './awsS3.service'
import { CaseFile } from './models'

@Module({
  imports: [CaseModule, CourtModule, SequelizeModule.forFeature([CaseFile])],
  controllers: [FileController],
  providers: [FileService, AwsS3Service],
})
export class FileModule {}
