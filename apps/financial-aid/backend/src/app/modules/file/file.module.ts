import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { AwsModule } from '@island.is/nest/aws'

import { FileController } from './file.controller'
import { FileService } from './file.service'
import { CloudFrontService } from './cloudFront.service'
import { ApplicationFileModel } from './models'
import { StaffModule } from '../staff/staff.module'

@Module({
  imports: [
    StaffModule,
    AwsModule,
    SequelizeModule.forFeature([ApplicationFileModel]),
  ],
  controllers: [FileController],
  providers: [FileService, CloudFrontService],
  exports: [FileService],
})
export class FileModule {}
