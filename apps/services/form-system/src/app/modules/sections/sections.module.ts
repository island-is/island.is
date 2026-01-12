import { Module } from '@nestjs/common'
import { SectionsController } from './sections.controller'
import { SectionsService } from './sections.service'
import { SequelizeModule } from '@nestjs/sequelize'
import { Section } from './models/section.model'
import { Form } from '../forms/models/form.model'

@Module({
  imports: [SequelizeModule.forFeature([Section, Form])],
  controllers: [SectionsController],
  providers: [SectionsService],
  exports: [SectionsService],
})
export class SectionsModule {}
