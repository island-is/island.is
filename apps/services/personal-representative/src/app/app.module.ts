import { RightTypesModule } from './modules/rightTypes/rightTypes.module'
import { PersonalRepresentativeModule } from './modules/personalRepresentative/personalRepresentative.module'
import { PersonalRepresentativeTypesModule } from './modules/personalRepresentativeTypes/personalRepresentativeTypes.module'
import { SequelizeConfigService } from '@island.is/auth-api-lib/personal-representative'
import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { environment } from '../environments'
import { AuditModule } from '@island.is/nest/audit'
import { AuthModule } from '@island.is/auth-nest-tools'

@Module({
  imports: [
    AuditModule.forRoot(environment.audit),
    AuthModule.register(environment.auth),
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    RightTypesModule,
    PersonalRepresentativeTypesModule,
    PersonalRepresentativeModule,
  ],
})
export class AppModule {}
