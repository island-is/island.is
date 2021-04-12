import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { Endorsement } from './endorsement.model'
import { EndorsementController } from './endorsement.controller'
import { EndorsementService } from './endorsement.service'

@Module({
  imports: [SequelizeModule.forFeature([Endorsement])],
  controllers: [EndorsementController],
  providers: [EndorsementService],
})
export class EndorsementModule {}
