import { RightTypesModule } from './modules/right-types/right-types.module'
import { PersonalRepresentativeModule } from './modules/personal-representative/personal-representative.module'
import { SequelizeConfigService } from '@island.is/auth-api-lib/personal-representative'
import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    RightTypesModule,
    PersonalRepresentativeModule,
  ],
})
export class AppModule {}
