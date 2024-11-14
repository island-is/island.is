import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { OrganizationListType } from './models/organizationListType.model'
import { OrganizationListTypesController } from './organizationListTypes.controller'
import { OrganizationListTypesService } from './organizationListTypes.service'

@Module({
  imports: [SequelizeModule.forFeature([OrganizationListType])],
  controllers: [OrganizationListTypesController],
  providers: [OrganizationListTypesService],
})
export class OrganizationListTypesModule {}
