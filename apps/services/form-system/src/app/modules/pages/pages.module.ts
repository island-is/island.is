import { Module } from '@nestjs/common'
import { PagesController } from './pages.controller'
import { PagesService } from './pages.service'
import { Page } from './models/page.model'
import { SequelizeModule } from '@nestjs/sequelize'

@Module({
  imports: [SequelizeModule.forFeature([Page])],
  controllers: [PagesController],
  providers: [PagesService],
})
export class PagesModule {}
