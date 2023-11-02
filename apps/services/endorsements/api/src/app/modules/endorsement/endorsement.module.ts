import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { Endorsement } from './models/endorsement.model'
import { EndorsementController } from './endorsement.controller'
import { EndorsementService } from './endorsement.service'
import { EndorsementList } from '../endorsementList/endorsementList.model'
import { EndorsementListService } from '../endorsementList/endorsementList.service'
import { environment } from '../../../environments'
import { EmailModule } from '@island.is/email-service'
import { NationalRegistryClientModule } from '@island.is/clients/national-registry-v2'

@Module({
  imports: [
    NationalRegistryClientModule,
    SequelizeModule.forFeature([Endorsement, EndorsementList]),
    EmailModule.register(environment.emailOptions),
  ],
  controllers: [EndorsementController],
  providers: [EndorsementService, EndorsementListService],
})
export class EndorsementModule {}
