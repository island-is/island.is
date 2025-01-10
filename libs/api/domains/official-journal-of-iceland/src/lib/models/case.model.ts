import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType('OfficialJournalOfIcelandCaseInProgress')
export class CaseInProgress {
  @Field(() => ID)
  id!: string

  @Field(() => String)
  title!: string | null

  @Field(() => String)
  involvedParty!: string | null

  @Field(() => String)
  status!: string | null

  @Field(() => String)
  createdAt!: string | null

  @Field(() => String)
  requestedPublicationDate!: string | null

  @Field(() => Boolean)
  fastTrack!: boolean | null
}
