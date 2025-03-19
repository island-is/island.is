import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { OrganizationUrl } from './models/organizationUrl.model'
import { OrganizationUrlsController } from './organizationUrls.controller'
import { OrganizationUrlsService } from './organizationUrls.service'

@Module({
  imports: [SequelizeModule.forFeature([OrganizationUrl])],
  controllers: [OrganizationUrlsController],
  providers: [OrganizationUrlsService],
})
export class OrganizationUrlsModule {}
