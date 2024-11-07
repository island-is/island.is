import { Controller, VERSION_NEUTRAL } from '@nestjs/common'

@Controller({
  path: 'organizationCertificationTypes',
  version: ['1', VERSION_NEUTRAL],
})
export class OrganizationCertificationTypesController {}
