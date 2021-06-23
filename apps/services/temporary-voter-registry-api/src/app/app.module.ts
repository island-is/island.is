import {
  AuthConfig,
  AuthModule,
  IdsUserGuard,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { SequelizeModule } from '@nestjs/sequelize'
import { environment } from '../environments'
import { VoterRegistryModule } from './modules/voterRegistry/voterRegistry.module'
import { SequelizeConfigService } from './sequelizeConfig.service'

@Module({
  imports: [
    AuthModule.register(environment.auth as AuthConfig),
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    VoterRegistryModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useExisting: IdsUserGuard,
    },
    IdsUserGuard, // allows test module to see this provider for mocking auth
    {
      provide: APP_GUARD,
      useClass: ScopesGuard,
    },
  ],
})
export class AppModule {}
