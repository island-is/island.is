import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { OrganizationUrl } from './models/organizationUrl.model'
import { OrganizationUrlsController } from './organizationUrls.controller'
import { OrganizationUrlsService } from './organizationUrls.service'
import { Organization } from '../organizations/models/organization.model'

@Module({
  imports: [SequelizeModule.forFeature([OrganizationUrl, Organization])],
  controllers: [OrganizationUrlsController],
  providers: [OrganizationUrlsService],
})
export class OrganizationUrlsModule {}
