import { registerEnumType } from '@nestjs/graphql'

import {
  GetOrganizationsByTypeTypeEnum,
  OrganizationModelSectorEnum,
  OrganizationModelSubTypeEnum,
} from '@island.is/clients/mms/frigg'

// Re-export so models imports from this file to make sure the registerEnumType is called before model references it.
export {
  GetOrganizationsByTypeTypeEnum,
  OrganizationModelSectorEnum,
  OrganizationModelSubTypeEnum,
} from '@island.is/clients/mms/frigg'

registerEnumType(GetOrganizationsByTypeTypeEnum, {
  name: 'OrganizationTypeEnum',
})

registerEnumType(OrganizationModelSubTypeEnum, {
  name: 'OrganizationSubTypeEnum',
})

registerEnumType(OrganizationModelSectorEnum, {
  name: 'OrganizationSectorEnum',
})
