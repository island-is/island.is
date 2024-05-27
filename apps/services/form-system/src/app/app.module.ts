import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
// import { AuthModule } from '@island.is/auth-nest-tools'
// import { AuditModule } from '@island.is/nest/audit'
import { ConfigModule } from '@island.is/nest/config'
import { environment } from '../environments'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { FormModule } from './modules/form/form.module'
import { SequelizeConfigService } from './sequelizeConfig.service'

@Module({
  imports: [
    // AuthModule.register(environment.auth),
    // AuditModule.forRoot(environment.audit),
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    FormModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
