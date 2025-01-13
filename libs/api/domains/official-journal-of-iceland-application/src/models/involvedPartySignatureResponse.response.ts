import { Field, ObjectType } from '@nestjs/graphql'
import { InvolvedPartySignatures } from './getInvolvedPartySignatures.response'

@ObjectType('OfficialJournalOfIcelandApplicationSignatureResponse')
export class SignaturesResponse {
  @Field()
  success!: boolean

  @Field(() => InvolvedPartySignatures, { nullable: true })
  data?: InvolvedPartySignatures
}
