import { registerEnumType } from '@nestjs/graphql'

import { DomainsControllerFindAllDirectionEnum } from '@island.is/clients/auth/delegation-api'

export const DomainDirection = DomainsControllerFindAllDirectionEnum

registerEnumType(DomainsControllerFindAllDirectionEnum, {
  name: 'AuthDomainDirection',
})
