import { Module } from '@nestjs/common'
import { ScreensController } from './screens.controller'
import { ScreensService } from './screens.service'
import { Screen } from './models/screen.model'
import { SequelizeModule } from '@nestjs/sequelize'

@Module({
  imports: [SequelizeModule.forFeature([Screen])],
  controllers: [ScreensController],
  providers: [ScreensService],
})
export class ScreensModule {}
