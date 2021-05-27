import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { VoterRegistry } from './voterRegistry.model'
import { VoterRegistryService } from './voterRegistry.service'
import { VoterRegistryController } from './voterRegistry.controller'

@Module({
  imports: [SequelizeModule.forFeature([VoterRegistry])],
  controllers: [VoterRegistryController],
  providers: [VoterRegistryService],
})
export class VoterRegistryModule {}
