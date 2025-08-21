import { Field, InputType } from '@nestjs/graphql'

import { DomainsControllerFindAllV1DirectionEnum } from '@island.is/clients/auth/delegation-api'

import { DomainDirection } from './domainDirection'

@InputType('AuthDomainsInput')
export class DomainsInput {
  @Field(() => String)
  lang = 'is'

  @Field(() => DomainDirection, { nullable: true })
  direction?: DomainsControllerFindAllV1DirectionEnum

  // Intentionally left out of GQL schema.
  domainNames?: string[]
}
