import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { ThjodskraModule } from './modules/thjodskra'
import { DiscountModule } from './modules/discount'
import { FlightModule } from './modules/flight'
import { UserModule } from './modules/user'
import { SequelizeConfigService } from './sequelizeConfig.service'

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    DiscountModule,
    FlightModule,
    UserModule,
    ThjodskraModule,
  ],
})
export class AppModule {}
