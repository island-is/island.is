import { Field, ID, ObjectType } from '@nestjs/graphql'
import { InvolvededParty } from './getUserInvolvedParties.response'

@ObjectType('OfficialJournalOfIcelandApplicationSignatureType')
export class SignatureType extends InvolvededParty {}

@ObjectType('OfficialJournalOfIcelandApplicationInstitution')
export class Institution extends InvolvededParty {}

@ObjectType('OfficialJournalOfIcelandApplicationSignatureMember')
export class SignatureMember {
  @Field()
  text!: string

  @Field({ nullable: true })
  textAbove?: string

  @Field({ nullable: true })
  textBefore?: string

  @Field({ nullable: true })
  textBelow?: string

  @Field({ nullable: true })
  textAfter?: string
}

@ObjectType(
  'OfficialJournalOfIcelandApplicationInvolvedPartySignaturesResponse',
)
export class GetInvolvedPartySignaturesResponse {
  @Field(() => ID)
  id!: string

  @Field({ nullable: true })
  institution?: string

  @Field({ nullable: true })
  date?: string

  @Field(() => SignatureType, { nullable: true })
  type?: SignatureType

  @Field(() => Institution, { nullable: true })
  involvedParty?: Institution

  @Field(() => [SignatureMember], { nullable: true })
  members?: Array<SignatureMember>

  @Field(() => SignatureMember, { nullable: true })
  chairman?: SignatureMember

  @Field({ nullable: true })
  additionalSignature?: string

  @Field({ nullable: true })
  html?: string
}
