import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize'
import { UsersModule } from './modules/users/users.module'
import { ClientsModule } from './modules/clients/clients.module'
import { ResourcesModule } from './modules/resources/resources.module'
import { AuthModule, SequelizeConfigService } from '@island.is/auth-api'

@Module({
  imports: [
    AuthModule,
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    UsersModule,
    ClientsModule,
    ResourcesModule,
    ConfigModule.forRoot(
      {
        envFilePath: ['.env', '.env.secret']
      }
    )
  ],
})
export class AppModule {}
