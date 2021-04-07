import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { EndorsementList } from './endorsementList.model'
import { EndorsementListController } from './endorsementList.controller'
import { EndorsementListService } from './endorsementList.service'

@Module({
  imports: [SequelizeModule.forFeature([EndorsementList])],
  controllers: [EndorsementListController],
  providers: [EndorsementListService],
})
export class EndorsementListModule {}
