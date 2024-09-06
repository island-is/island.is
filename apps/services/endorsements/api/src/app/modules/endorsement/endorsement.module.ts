import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { Endorsement } from './models/endorsement.model'
import { EndorsementController } from './endorsement.controller'
import { EndorsementService } from './endorsement.service'
import { EndorsementList } from '../endorsementList/endorsementList.model'
import { EndorsementListService } from '../endorsementList/endorsementList.service'
import { EmailModule } from '@island.is/email-service'
import { NationalRegistryV3ClientModule } from '@island.is/clients/national-registry-v3'
import { AwsModule } from '@island.is/nest/aws'

@Module({
  imports: [
    NationalRegistryV3ClientModule,
    SequelizeModule.forFeature([Endorsement, EndorsementList]),
    EmailModule,
    AwsModule,
  ],
  controllers: [EndorsementController],
  providers: [EndorsementService, EndorsementListService],
})
export class EndorsementModule {}
