import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { SequelizeConfigService } from './sequelizeConfig.service'
import { CaseModule } from './modules/case/case.module'
import { AuthModule } from './modules/auth/auth.module'

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    CaseModule,
    AuthModule,
  ],
})
export class AppModule {}
