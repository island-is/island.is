import { Field, InputType } from '@nestjs/graphql'

@InputType('OfficialJournalOfIcelandApplicationInvolvedPartySignaturesInput')
export class GetInvolvedPartySignaturesInput {
  @Field()
  involvedPartyId!: string
}
