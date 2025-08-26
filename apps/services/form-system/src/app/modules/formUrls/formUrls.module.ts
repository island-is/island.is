import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { FormUrl } from './models/formUrl.model'
import { FormUrlsController } from './formUrls.controller'
import { OrganizationUrl } from '../organizationUrls/models/organizationUrl.model'
import { FormUrlsService } from './formUrls.service'

@Module({
  imports: [SequelizeModule.forFeature([FormUrl, OrganizationUrl])],
  controllers: [FormUrlsController],
  providers: [FormUrlsService],
})
export class FormUrlsModule {}
