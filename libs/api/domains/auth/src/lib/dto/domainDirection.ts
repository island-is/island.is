import { registerEnumType } from '@nestjs/graphql'

import { DomainsControllerFindAllV1DirectionEnum } from '@island.is/clients/auth/delegation-api'

export const DomainDirection = DomainsControllerFindAllV1DirectionEnum

registerEnumType(DomainsControllerFindAllV1DirectionEnum, {
  name: 'AuthDomainDirection',
})
