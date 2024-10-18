import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { ListType } from './models/listType.model'
import { OrganizationListType } from './models/organizationListType.model'

@Module({
  imports: [SequelizeModule.forFeature([ListType, OrganizationListType])],
})
export class ListsModule {}
