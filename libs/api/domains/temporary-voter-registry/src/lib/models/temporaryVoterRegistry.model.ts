import { Field, ObjectType, ID } from '@nestjs/graphql'

@ObjectType()
export class TemporaryVoterRegistry {
  @Field(() => ID)
  id!: string

  @Field()
  nationalId!: string

  @Field()
  regionNumber!: number

  @Field()
  regionName!: string
}
