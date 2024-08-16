import { Module } from '@nestjs/common'
import { SectionsController } from './sections.controller'
import { SectionsService } from './sections.service'
import { SequelizeModule } from '@nestjs/sequelize'
import { Section } from './models/section.model'

@Module({
  imports: [SequelizeModule.forFeature([Section])],
  controllers: [SectionsController],
  providers: [SectionsService],
  exports: [SectionsService],
})
export class SectionsModule {}
