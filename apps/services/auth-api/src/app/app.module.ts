import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize'
import { UsersModule } from './modules/users/users.module'
import { SequelizeConfigService } from '@island.is/auth-api-lib'
import { ClientsModule } from './modules/clients/clients.module'
import { ResourcesModule } from './modules/resources/resources.module'
import { GrantsModule } from './modules/grants/grants.module'
import { AuthModule } from '@island.is/auth-api-lib'

@Module({
  imports: [
    AuthModule.register({
      audience: '@identityserver.api',
      issuer: 'https://localhost:6001', // TODO: Get from env
      jwksUri: 'http://localhost:6002/.well-known/openid-configuration/jwks', // TODO: Get from env
    }),
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    UsersModule,
    ClientsModule,
    ResourcesModule,
    GrantsModule,
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.secret'],
    }),
  ],
})
export class AppModule {}
