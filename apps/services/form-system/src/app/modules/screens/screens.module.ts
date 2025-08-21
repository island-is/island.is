import { Module } from '@nestjs/common'
import { ScreensController } from './screens.controller'
import { ScreensService } from './screens.service'
import { Screen } from './models/screen.model'
import { SequelizeModule } from '@nestjs/sequelize'
import { Section } from '../sections/models/section.model'
import { Form } from '../forms/models/form.model'

@Module({
  imports: [SequelizeModule.forFeature([Section, Screen, Form])],
  controllers: [ScreensController],
  providers: [ScreensService],
})
export class ScreensModule {}
