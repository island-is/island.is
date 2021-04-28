import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { EndorsementList } from './endorsementList.model'
import { EndorsementListController } from './endorsementList.controller'
import { EndorsementListService } from './endorsementList.service'
import { Endorsement } from '../endorsement/endorsement.model'

@Module({
  imports: [SequelizeModule.forFeature([EndorsementList, Endorsement])],
  controllers: [EndorsementListController],
  providers: [EndorsementListService],
})
export class EndorsementListModule {}
