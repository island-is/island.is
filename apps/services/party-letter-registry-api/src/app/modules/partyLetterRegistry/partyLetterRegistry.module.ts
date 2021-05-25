import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { PartyLetterRegistry } from './partyLetterRegistry.model'
import { PartyLetterRegistryService } from './partyLetterRegistry.service'
import { PartyLetterRegistryController } from './partyLetterRegistry.controller'

@Module({
  imports: [SequelizeModule.forFeature([PartyLetterRegistry])],
  controllers: [PartyLetterRegistryController],
  providers: [PartyLetterRegistryService],
})
export class PartyLetterRegistryModule {}
