import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('OfficialJournalOfIcelandApplicationGetUserInvolvedParty')
export class InvolvededParty {
  @Field({ description: 'The id of the involved party' })
  id!: string

  @Field({ description: 'The title of the involved party' })
  title!: string

  @Field({ description: 'The slug of the involved party' })
  slug!: string
}

@ObjectType('OfficialJournalOfIcelandApplicationGetUserInvolvedPartiesResponse')
export class GetUserInvolvedPartiesResponse {
  @Field(() => [InvolvededParty])
  involvedParties!: InvolvededParty[]
}
