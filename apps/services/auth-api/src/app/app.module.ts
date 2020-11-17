import { AuthModule, SequelizeConfigService } from '@island.is/auth-api-lib'
import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { ClientsModule } from './modules/clients/clients.module'
import { GrantsModule } from './modules/grants/grants.module'
import { ResourcesModule } from './modules/resources/resources.module'
import { UsersModule } from './modules/users/users.module'
import { environment } from '../environments'
@Module({
  imports: [
    AuthModule.register({
      audience: '@identityserver.api',
      issuer: environment.auth.issuer,
      jwksUri: environment.auth.jwksUri,
    }),
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    UsersModule,
    ClientsModule,
    ResourcesModule,
    GrantsModule,
  ],
})
export class AppModule {}
