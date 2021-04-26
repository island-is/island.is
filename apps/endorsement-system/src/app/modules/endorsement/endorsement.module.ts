import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { Endorsement } from './endorsement.model'
import { EndorsementController } from './endorsement.controller'
import { EndorsementService } from './endorsement.service'
import { EndorsementMetadataModule } from '../endorsementMetadata/endorsementMetadata.module'
import { EndorsementList } from '../endorsementList/endorsementList.model'
import { EndorsementValidatorModule } from '../endorsementValidator/endorsementValidator.module'

@Module({
  imports: [
    SequelizeModule.forFeature([Endorsement, EndorsementList]),
    EndorsementMetadataModule,
    EndorsementValidatorModule,
  ],
  controllers: [EndorsementController],
  providers: [EndorsementService],
})
export class EndorsementModule {}
