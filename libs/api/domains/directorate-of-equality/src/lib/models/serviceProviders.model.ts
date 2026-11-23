import { Field, ObjectType } from '@nestjs/graphql'

import { ServiceProvider } from './serviceProvider.model'

@ObjectType('DirectorateOfEqualityServiceProviders')
export class ServiceProviders {
  @Field(() => [ServiceProvider])
  items!: ServiceProvider[]
}
