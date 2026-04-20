import { Field, ID, ObjectType, GraphQLISODateTime } from '@nestjs/graphql'
import { ReferralStatusEnum } from './enums'

@ObjectType('HealthDirectorateReferralContact')
export class ReferralContact {
  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  profession?: string

  @Field({ nullable: true })
  department?: string

  @Field({ nullable: true })
  institute?: string
}

@ObjectType('HealthDirectorateReferral')
export class Referral {
  @Field(() => ID)
  id!: string

  @Field({ nullable: true })
  serviceName?: string

  @Field(() => GraphQLISODateTime, { nullable: true })
  createdDate?: Date

  @Field(() => GraphQLISODateTime, { nullable: true })
  validUntilDate?: Date

  @Field({ nullable: true })
  stateDisplay?: string

  @Field(() => ReferralStatusEnum, { nullable: true })
  status?: ReferralStatusEnum

  @Field({ nullable: true })
  reason?: string

  @Field({ nullable: true })
  diagnoses?: string

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
