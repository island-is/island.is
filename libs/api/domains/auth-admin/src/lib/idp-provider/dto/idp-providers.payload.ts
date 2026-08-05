import { Field, Int, ObjectType } from '@nestjs/graphql'

import { IdpProviderListItem } from '../models/idp-provider-list-item.model'

@ObjectType('AuthAdminIdpProvidersPayload')
export class IdpProvidersPayload {
  @Field(() => [IdpProviderListItem])
  rows!: IdpProviderListItem[]

  @Field(() => Int)
  totalCount!: number
}
