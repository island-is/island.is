import { RightsModule } from './modules/rights/rights.module'
import { PersonalRepresentativesModule } from './modules/personalRepresentatives/personalRepresentatives.module'
import { SequelizeConfigService } from '@island.is/auth-api-lib'
import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { environment } from '../environments'
import { AuditModule, AuditConfig } from '@island.is/nest/audit'
import { AuthModule } from '@island.is/auth-nest-tools'
import { ConfigModule } from '@island.is/nest/config'

@Module({
  imports: [
    AuditModule,
    AuthModule.register(environment.auth),
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    RightsModule,
    PersonalRepresentativesModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [AuditConfig],
    }),
  ],
})
export class AppModule {}
