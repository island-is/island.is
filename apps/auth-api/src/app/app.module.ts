import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { UserIdentitiesModule } from './modules/user-identities/user-identities.module'
import { SequelizeConfigService } from './sequelizeConfig.service'
import { UserProfilesModule } from './modules/user-profiles/user-profiles.module'

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    UserIdentitiesModule,
    UserProfilesModule,
  ],
})
export class AppModule {}
