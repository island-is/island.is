import { SequelizeConfigService } from '@island.is/auth-api-lib'
import { AuthModule } from '@island.is/auth-nest-tools'
import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { environment } from '../environments'
import { DelegationScopeModule } from './modules/delegation-scopes/delegation-scope.module'
import { DelegationsModule } from './modules/delegations/delegations.module'

@Module({
  imports: [
    AuthModule.register({
      audience: '@island.is/auth/public',
      issuer: environment.auth.issuer,
      jwksUri: environment.auth.jwksUri,
    }),
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    DelegationsModule,
  ],
})
export class AppModule {}
