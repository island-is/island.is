import { Field, InputType } from '@nestjs/graphql'

@InputType('OfficialJournalOfIcelandApplicationInvolvedPartySignaturesInput')
export class GetInvolvedPartySignaturesInput {
  @Field()
  involvedPartyId!: string

  @Field({ nullable: true })
  skip?: boolean
}
