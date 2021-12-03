import { RightTypesModule } from './modules/right-types/right-types.module'
import { PersonalRepresentativeModule } from './modules/personal-representative/personal-representative.module'
import { SequelizeConfigService } from '@island.is/auth-api-lib/personal-representative'
import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { environment } from '../environments'
import { AuditModule } from '@island.is/nest/audit'

@Module({
  imports: [
    AuditModule.forRoot(environment.audit),
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    RightTypesModule,
    PersonalRepresentativeModule,
  ],
})
export class AppModule {}
