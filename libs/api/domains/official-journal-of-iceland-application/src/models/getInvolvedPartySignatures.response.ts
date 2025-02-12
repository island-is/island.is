import { Field, ObjectType } from '@nestjs/graphql'
import { InvolvededParty } from './getUserInvolvedParties.response'

@ObjectType('OfficialJournalOfIcelandApplicationInstitution')
export class Institution extends InvolvededParty {}

@ObjectType('OfficialJournalOfIcelandApplicationSignatureMember')
export class SignatureMember {
  @Field()
  name!: string

  @Field({ nullable: true })
  above?: string

  @Field({ nullable: true })
  before?: string

  @Field({ nullable: true })
  below?: string

  @Field({ nullable: true })
  after?: string
}

@ObjectType('OfficialJournalOfIcelandApplicationInvolvedPartySignature')
export class InvolvedPartySignatures {
  @Field()
  institution!: string

  @Field()
  signatureDate!: string

  @Field(() => [SignatureMember])
  members!: Array<SignatureMember>

  @Field({ nullable: true })
  additionalSignature?: string
}

@ObjectType('OfficialJournalOfIcelandApplicationInvolvedPartySignatureResponse')
export class GetInvolvedPartySignature {
  @Field(() => [InvolvedPartySignatures])
  records!: InvolvedPartySignatures[]
}
