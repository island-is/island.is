import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('OfficialJournalOfIcelandApplicationGetUserInvolvedParty')
export class InvolvededParty {
  @Field({ description: 'The id of the involved party' })
  id!: string

  @Field({ description: 'The title of the involved party' })
  title!: string

  @Field({ description: 'The slug of the involved party' })
  slug!: string

  @Field(() => String, {
    description: 'The nationalId of the involved party',
    nullable: true,
  })
  nationalId?: string | null
}

@ObjectType('OfficialJournalOfIcelandApplicationGetUserInvolvedPartiesResponse')
export class GetUserInvolvedPartiesResponse {
  @Field(() => [InvolvededParty])
  involvedParties!: InvolvededParty[]
}

@ObjectType('OfficialJournalOfIcelandApplicationGetMyUserInfoResponse')
export class GetMyUserInfoResponse {
  @Field({ description: 'The first name of the user' })
  firstName!: string

  @Field({ description: 'The last name of the user' })
  lastName!: string

  @Field({ description: 'The email of the user' })
  email!: string
}
