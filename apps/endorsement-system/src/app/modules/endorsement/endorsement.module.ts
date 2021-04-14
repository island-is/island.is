import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { Endorsement } from './endorsement.model'
import { EndorsementController } from './endorsement.controller'
import { EndorsementService } from './endorsement.service'
import { MetadataModule } from '../metadata/metadata.module'
import { EndorsementList } from '../endorsementList/endorsementList.model'

@Module({
  imports: [
    SequelizeModule.forFeature([Endorsement, EndorsementList]),
    MetadataModule,
  ],
  controllers: [EndorsementController],
  providers: [EndorsementService],
})
export class EndorsementModule {}
