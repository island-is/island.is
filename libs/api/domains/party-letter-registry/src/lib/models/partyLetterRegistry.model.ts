import { Field, ObjectType, ID } from '@nestjs/graphql'

@ObjectType()
export class PartyLetterRegistry {
  @Field(() => ID)
  partyLetter!: string

  @Field()
  partyName!: string

  @Field()
  owner!: string

  @Field(() => [String])
  managers!: string[]
}
