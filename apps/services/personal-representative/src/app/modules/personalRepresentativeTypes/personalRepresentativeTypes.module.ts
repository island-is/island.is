import { PersonalRepresentativeTypesController } from './personalRepresentativeTypes.controller'
import { Module } from '@nestjs/common'
import {
  PersonalRepresentativeTypeService,
  PersonalRepresentativeType,
} from '@island.is/auth-api-lib/personal-representative'
import { SequelizeModule } from '@nestjs/sequelize'

@Module({
  imports: [SequelizeModule.forFeature([PersonalRepresentativeType])],
  controllers: [PersonalRepresentativeTypesController],
  providers: [PersonalRepresentativeTypeService],
})
export class PersonalRepresentativeTypesModule {}
