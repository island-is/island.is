import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { Application } from './application/application.model'
import { ApplicationService } from './application/application.service'
import { Payment } from './application/payment.model'
import { SequelizeConfigService } from './sequelizeConfig.service'

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    SequelizeModule.forFeature([Application, Payment]),
  ],
  providers: [ApplicationService],
  exports: [ApplicationService],
})
export class ApplicationApiCoreModule {}
