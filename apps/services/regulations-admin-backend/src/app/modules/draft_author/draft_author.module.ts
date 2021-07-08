import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { DraftAuthorService } from './draft_author.service'
import { DraftAuthorController } from './draft_author.controller'
import { DraftAuthor } from './draft_author.model'

@Module({
  imports: [SequelizeModule.forFeature([DraftAuthor])],
  providers: [DraftAuthorService],
  controllers: [DraftAuthorController],
  exports: [DraftAuthorService],
})
export class DraftAuthorModule {}
