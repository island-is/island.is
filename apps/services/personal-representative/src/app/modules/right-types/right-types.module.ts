import { RightTypesController } from './right-types.controller'
import { Module } from '@nestjs/common'
import { PersonalRepresentativeRightType, PersonalRepresentativeRightTypeService } from '@island.is/auth-api-lib'
import { SequelizeModule } from '@nestjs/sequelize'

@Module({
  imports: [SequelizeModule.forFeature([PersonalRepresentativeRightType])],
  controllers: [RightTypesController],
  providers: [PersonalRepresentativeRightTypeService],
})
export class RightTypesModule {}
