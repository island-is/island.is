import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { DraftLawChapterService } from './draft_law_chapter.service'
import { DraftLawChapterController } from './draft_law_chapter.controller'
import { DraftLawChapter } from './draft_law_chapter.model'

@Module({
  imports: [SequelizeModule.forFeature([DraftLawChapter])],
  providers: [DraftLawChapterService],
  controllers: [DraftLawChapterController],
  exports: [DraftLawChapterService],
})
export class DraftLawChapterModule {}
