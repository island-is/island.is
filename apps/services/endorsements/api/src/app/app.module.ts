import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { EndorsementModule } from './modules/endorsement/endorsement.module'
import { EndorsementListModule } from './modules/endorsementList/endorsementList.module'
import { SequelizeConfigService } from './sequelizeConfig.service'

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    EndorsementModule,
    EndorsementListModule,
  ],
})
export class AppModule {}
