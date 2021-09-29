import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { ApplicationModel } from './models'
import { ApplicationEventModule } from '../applicationEvent'
import { ApplicationController } from './application.controller'
import { ApplicationService } from './application.service'
import { FileModule } from '../file'
import { AuthModule } from '@island.is/auth-nest-tools'
import { environment } from '../../../environments'

@Module({
  imports: [
    FileModule,
    ApplicationEventModule,
    SequelizeModule.forFeature([ApplicationModel]),
    AuthModule.register(environment.identityServerAuth),
  ],
  providers: [ApplicationService],
  controllers: [ApplicationController],
  exports: [ApplicationService],
})
export class ApplicationModule {}
