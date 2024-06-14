import { OmitType } from '@nestjs/swagger'
import { Organization } from '../organization.model'

export class OrganizationDto extends OmitType(Organization, ['id'] as const) {}
