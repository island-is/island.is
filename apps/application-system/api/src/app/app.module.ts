import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { AuthModule } from '@island.is/auth-api-lib'
import { SequelizeConfigService } from './sequelizeConfig.service'
import { ApplicationModule } from './modules/application/application.module'
import { environment } from '../environments'

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    ApplicationModule,
    AuthModule.register({
      audience: environment.identityServer.audience,
      issuer: environment.identityServer.issuer,
      jwksUri: `${environment.identityServer.jwksUri}`,
    }),
  ],
})
export class AppModule {}
