import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { VoterRegistryModule } from './modules/voterRegistry/voterRegistry.module'
import { SequelizeConfigService } from './sequelizeConfig.service'

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    VoterRegistryModule,
  ],
})
export class AppModule {}
