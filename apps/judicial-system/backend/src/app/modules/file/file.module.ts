import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { CaseModule } from '../case'
import { FileController } from './file.controller'
import { FileService } from './file.service'
import { AwsS3Service } from './awsS3.service'
import { File } from './models'

@Module({
  imports: [CaseModule, SequelizeModule.forFeature([File])],
  controllers: [FileController],
  providers: [FileService, AwsS3Service],
})
export class FileModule {}
