import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType('HealthDirectorateReferralContact')
export class ReferralContact {
  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  profession?: string

  @Field({ nullable: true })
  department?: string
}

@ObjectType('HealthDirectorateReferral')
export class Referral {
  @Field(() => ID)
  id!: string

  @Field({ nullable: true })
  serviceName?: string

  @Field(() => Date, { nullable: true })
  createdDate?: Date

  @Field(() => Date, { nullable: true })
  validUntilDate?: Date

  @Field({ nullable: true })
  stateDisplay?: string

  @Field({ nullable: true })
  reason?: string

  @Field({ nullable: true })
  fromContactInfo?: ReferralContact

  @Field({ nullable: true })
  toContactInfo?: ReferralContact
}

@ObjectType('HealthDirectorateReferrals')
export class Referrals {
  @Field(() => [Referral])
  referrals!: Referral[]
}
