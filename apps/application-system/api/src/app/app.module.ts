import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize'
import { SequelizeConfigService } from './core/db/config.service'
import { ApplicationsModule } from './modules/applications/applications.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    ApplicationsModule,
  ],
})
export class AppModule {}
