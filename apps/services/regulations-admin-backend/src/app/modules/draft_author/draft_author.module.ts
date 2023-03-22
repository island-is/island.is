import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { DraftAuthorService } from './draft_author.service'
import { DraftAuthorController } from './draft_author.controller'
import { DraftAuthorModel } from './draft_author.model'

@Module({
  imports: [SequelizeModule.forFeature([DraftAuthorModel])],
  providers: [DraftAuthorService],
  controllers: [DraftAuthorController],
  exports: [DraftAuthorService],
})
export class DraftAuthorModule {}
