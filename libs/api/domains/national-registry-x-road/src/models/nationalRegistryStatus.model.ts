import { Field, ObjectType, ID } from '@nestjs/graphql'

@ObjectType()
export class NationalRegistryStatus {
  @Field(() => ID)
  status!: string

  @Field(() => [String])
  data!: string[]
}
