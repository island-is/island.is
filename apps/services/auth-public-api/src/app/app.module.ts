import { SequelizeConfigService } from '@island.is/auth-api-lib'
import { AuthModule } from '@island.is/auth-nest-tools'
import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { environment } from '../environments'
import { DelegationsModule } from './modules/delegations/delegations.module'
import { ApiScopeModule } from './modules/resources/api-scope.module'

@Module({
  imports: [
    AuthModule.register(environment.auth),
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    DelegationsModule,
    ApiScopeModule,
  ],
})
export class AppModule {}
