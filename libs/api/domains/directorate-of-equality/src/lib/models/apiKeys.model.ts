import { Field, ObjectType } from '@nestjs/graphql'

import { ApiKey } from './apiKey.model'

@ObjectType('DirectorateOfEqualityApiKeys')
export class ApiKeys {
  @Field(() => [ApiKey], { description: 'Newest first' })
  items!: ApiKey[]
}
