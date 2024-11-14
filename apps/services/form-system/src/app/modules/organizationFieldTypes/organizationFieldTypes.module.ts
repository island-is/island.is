import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { OrganizationFieldType } from './models/organizationFieldType.model'
import { OrganizationFieldTypesController } from './organizationFieldTypes.controller'
import { OrganizationFieldTypesService } from './organizationFieldTypes.service'

@Module({
  imports: [SequelizeModule.forFeature([OrganizationFieldType])],
  controllers: [OrganizationFieldTypesController],
  providers: [OrganizationFieldTypesService],
})
export class OrganizationFieldTypesModule {}
