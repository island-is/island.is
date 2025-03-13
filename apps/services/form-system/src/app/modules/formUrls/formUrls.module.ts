import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { FormUrl } from './models/formUrl.model'
import { FormUrlsController } from './formUrls.controller'
import { FormUrlsService } from './formUrls.services'
import { OrganizationUrl } from '../organizationUrls/models/organizationUrl.model'

@Module({
  imports: [SequelizeModule.forFeature([FormUrl, OrganizationUrl])],
  controllers: [FormUrlsController],
  providers: [FormUrlsService],
})
export class FormUrlsModule {}
