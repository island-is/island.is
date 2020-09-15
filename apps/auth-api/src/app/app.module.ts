import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize'
import { UsersModule } from './modules/users/users.module'
import { SequelizeConfigService } from './sequelizeConfig.service'
import { ClientsModule } from './modules/clients/clients.module'
import { ResourcesModule } from './modules/resources/resources.module'
import { GrantsModule } from './modules/grants/grants.module'
import { AuthModule } from '@island.is/auth-api'
import { GrantTypesModule } from './modules/grant-types/grant-types.module';

@Module({
  imports: [
    AuthModule,
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    UsersModule,
    ClientsModule,
    ResourcesModule,
    GrantsModule,
    GrantTypesModule,
    ConfigModule.forRoot(
      {
        envFilePath: ['.env', '.env.secret']
      }
    )
  ],
})
export class AppModule {}
