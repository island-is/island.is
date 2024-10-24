import { Controller, VERSION_NEUTRAL } from '@nestjs/common'

@Controller({
  path: 'organizationCertifications',
  version: ['1', VERSION_NEUTRAL],
})
export class OrganizationCertificationsController {}
