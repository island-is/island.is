import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize'
import { UserIdentitiesModule } from './modules/user-identities/user-identities.module'
import { SequelizeConfigService } from './sequelizeConfig.service'
import { UserProfilesModule } from './modules/user-profiles/user-profiles.module'
import { ClientsModule } from './modules/clients/clients.module'
import { ResourcesModule } from './modules/resources/resources.module'
import { GrantsModule } from './modules/grants/grants.module'
import { AuthModule } from './modules/auth/auth.module'
import { GrantTypesModule } from './modules/grant-types/grant-types.module';


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
    GrantsModule,
    GrantTypesModule,
    ConfigModule.forRoot(
      {
        envFilePath: 'test.env'
      }
    )
  ],
})
export class AppModule {}
