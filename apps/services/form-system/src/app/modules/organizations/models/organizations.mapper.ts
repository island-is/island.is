import { Injectable } from '@nestjs/common'
import { Organization } from './organization.model'
// import { OrganizationsDto } from './dto/organizations.dto'
import { OrganizationDto } from './dto/organization.dto'

@Injectable()
export class OrganizationsMapper {
  mapOrganizationsToOrganizationsDto(
    organizations: Organization[],
  ): OrganizationDto[] {
    const organizationsDto: OrganizationDto[] = organizations.map(
      (organization) => {
        return {
          name: organization.name,
          nationalId: organization.nationalId,
        } as OrganizationDto
      },
    )
    return organizationsDto
  }

  mapOrganizationToOrganizationDto(
    organization: Organization,
  ): OrganizationDto {
    const organizationDto: OrganizationDto = {
      name: organization.name,
      nationalId: organization.nationalId,
      forms: organization.forms,
    }
    return organizationDto
  }
}
