import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { UserIdentitiesModule } from './modules/user-identities/user-identities.module'
import { SequelizeConfigService } from './sequelizeConfig.service'
import { UserProfilesModule } from './modules/user-profiles/user-profiles.module'
import { ClientsModule } from './modules/clients/clients.module'
import { ResourcesModule } from './modules/resources/resources.module'
import { GrantsModule } from './modules/grants/grants.module'
import { AuthModule } from './modules/auth/auth.module'

@Module({
  imports: [
    AuthModule,
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    UserIdentitiesModule,
    UserProfilesModule,
    ClientsModule,
    ResourcesModule,
    GrantsModule
  ],
})
export class AppModule {}
