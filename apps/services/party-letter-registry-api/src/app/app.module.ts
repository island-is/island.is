import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { PartyLetterRegistryModule } from './modules/partyLetterRegistry/partyLetterRegistry.module'
import { SequelizeConfigService } from './sequelizeConfig.service'

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    PartyLetterRegistryModule,
  ],
})
export class AppModule {}
