import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { OrganizationFieldType } from './models/organizationFieldType.model'

@Module({
  imports: [SequelizeModule.forFeature([OrganizationFieldType])],
  // controllers: [OrganizationCertificationsController],
  // providers: [OrganizationCertificationsService],
})
export class OrganizationFieldTypesModule {}
