import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { ProblemModule } from '@island.is/nest/problem'
import { SequelizeConfigService } from './sequelizeConfig.service'
import { ApplicationModule } from './modules/application/application.module'
import { SyslumennClientConfig } from '@island.is/clients/syslumenn'
import { ConfigModule } from '@island.is/nest/config'

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    ApplicationModule,
    ProblemModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        SyslumennClientConfig,
      ],
    }),
  ],
})
export class AppModule {}
