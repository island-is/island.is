import { Field, ID, InterfaceType, ObjectType } from '@nestjs/graphql'
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

@InterfaceType('OfficialJournalOfIcelandApplicationInvolvedPartySignatures', {
  resolveType(res) {
    if (res.chairman) {
      return InvolvedPartySignaturesCommittee
    }
    return InvolvedPartySignaturesRegular
  },
})
export abstract class InvolvedPartySignatures {
  @Field(() => ID)
  id!: string

  @Field()
  institution!: string

  @Field()
  date!: string

  @Field(() => Institution, { nullable: true })
  involvedParty?: Institution

  @Field(() => [SignatureMember])
  members!: Array<SignatureMember>

  @Field({ nullable: true })
  additionalSignature?: string

  @Field({ nullable: true })
  html?: string
}

@ObjectType(
  'OfficialJournalOfIcelandApplicationInvolvedPartySignaturesRegular',
  {
    implements: () => InvolvedPartySignatures,
  },
)
export class InvolvedPartySignaturesRegular
  extends InvolvedPartySignatures
  implements InvolvedPartySignatures {}

@ObjectType(
  'OfficialJournalOfIcelandApplicationInvolvedPartySignaturesCommittee',
  {
    implements: () => InvolvedPartySignatures,
  },
)
export class InvolvedPartySignaturesCommittee
  extends InvolvedPartySignatures
  implements InvolvedPartySignatures
{
  @Field(() => SignatureMember)
  chairman!: SignatureMember
}
