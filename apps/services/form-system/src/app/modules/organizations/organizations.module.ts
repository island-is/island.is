import { Module } from '@nestjs/common'
import { OrganizationsController } from './organizations.controller'
import { OrganizationsService } from './organizations.service'
import { SequelizeModule } from '@nestjs/sequelize'
import { Organization } from './models/organization.model'
import { ApplicantTypeNameSuggestion } from '../applicants/models/applicantTypeNameSuggestion.model'

@Module({
  imports: [
    SequelizeModule.forFeature([Organization, ApplicantTypeNameSuggestion]),
  ],
  controllers: [OrganizationsController],
  providers: [OrganizationsService],
})
export class OrganizationsModule {}
