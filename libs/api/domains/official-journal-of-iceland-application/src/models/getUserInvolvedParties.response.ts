import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('OfficialJournalOfIcelandApplicationGetUserInvolvedParty')
export class InvovledParty {
  @Field()
  id!: string

  @Field()
  title!: string

  @Field()
  slug!: string
}

@ObjectType('OfficialJournalOfIcelandApplicationGetUserInvolvedPartiesResponse')
export class GetUserInvolvedPartiesResponse {
  @Field(() => [InvovledParty])
  involvedParties!: InvovledParty[]
}
