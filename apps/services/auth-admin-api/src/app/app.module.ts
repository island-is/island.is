import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize'
import { UsersModule } from './modules/users/users.module'
import { GrantTypesModule } from './modules/grant-types/grant-types.module'
import { ClientsModule } from './modules/clients/clients.module'
import { ResourcesModule } from './modules/resources/resources.module'
import { SequelizeConfigService } from '@island.is/auth-api-lib'
import { AuthModule } from '@island.is/auth-nest-tools'
import { ClaimsModule } from './modules/claims/claims.module'
import { environment } from '../environments/environment'
import { AccessModule } from './modules/access/access.module'

@Module({
  imports: [
    AuthModule.register({
      audience: 'auth-admin-api',
      issuer: environment.auth.issuer,
      jwksUri: environment.auth.jwksUri,
    }),
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    UsersModule,
    ClientsModule,
    ResourcesModule,
    GrantTypesModule,
    ClaimsModule,
    AccessModule,
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.secret'],
    }),
  ],
})
export class AppModule {}
