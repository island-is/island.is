import { RightsController } from './rights.controller'
import { Module } from '@nestjs/common'
import {
  PersonalRepresentative,
  PersonalRepresentativeRight,
  PersonalRepresentativeService,
} from '@island.is/auth-api-lib/personal-representative'
import { SequelizeModule } from '@nestjs/sequelize'

@Module({
  imports: [
    SequelizeModule.forFeature([
      PersonalRepresentativeRight,
      PersonalRepresentative,
    ]),
  ],
  controllers: [RightsController],
  providers: [PersonalRepresentativeService],
})
export class RightsModule {}
