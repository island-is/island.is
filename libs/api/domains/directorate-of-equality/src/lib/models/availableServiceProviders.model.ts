import { Field, ObjectType } from '@nestjs/graphql'

import { AvailableServiceProvider } from './availableServiceProvider.model'

@ObjectType('DirectorateOfEqualityAvailableServiceProviders')
export class AvailableServiceProviders {
  @Field(() => [AvailableServiceProvider])
  items!: AvailableServiceProvider[]
}
