import { ConfigModule } from '@island.is/nest/config'
import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { SequelizeConfigService } from './sequelizeConfig.service'
import { UserProfileModule } from './user-profile/userProfile.module'
import { IslykillClientConfig } from '@island.is/clients/islykill'

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    UserProfileModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [IslykillClientConfig],
    }),
  ],
})
export class AppModule {}
