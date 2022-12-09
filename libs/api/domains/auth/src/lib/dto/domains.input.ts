import { Field, InputType } from '@nestjs/graphql'

import { DomainsControllerFindAllDirectionEnum } from '@island.is/clients/auth/delegation-api'

import { DomainDirection } from './domainDirection'

@InputType('AuthDomainsInput')
export class DomainsInput {
  @Field(() => String)
  lang = 'is'

  @Field(() => DomainDirection, { nullable: true })
  direction?: DomainsControllerFindAllDirectionEnum
}
