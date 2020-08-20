import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { DiscountModule } from './modules/discount/discount.module'
import { FlightModule } from './modules/flight/flight.module'
import { SequelizeConfigService } from './sequelizeConfig.service'

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    DiscountModule,
    FlightModule,
  ],
})
export class AppModule {}
