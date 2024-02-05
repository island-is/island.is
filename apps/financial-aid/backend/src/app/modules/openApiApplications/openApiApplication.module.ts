import { forwardRef, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { OpenApiApplicationController } from './openApiApplication.controller'
import { OpenApiApplicationService } from './openApiApplication.service'
import { StaffModule, ApiUserModule } from '../index'
import { ApplicationModel } from '../application/models'

@Module({
  imports: [
    forwardRef(() => ApiUserModule),
    forwardRef(() => StaffModule),
    SequelizeModule.forFeature([ApplicationModel]),
  ],
  providers: [OpenApiApplicationService],
  controllers: [OpenApiApplicationController],
  exports: [OpenApiApplicationService],
})
export class OpenApiApplicationModule {}
