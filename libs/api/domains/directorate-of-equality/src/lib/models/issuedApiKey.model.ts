import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType('DirectorateOfEqualityIssuedApiKey')
export class IssuedApiKey {
  @Field(() => ID)
  id!: string

  @Field(() => String, {
    description: 'The full key — returned only once, never retrievable again',
  })
  key!: string
}
