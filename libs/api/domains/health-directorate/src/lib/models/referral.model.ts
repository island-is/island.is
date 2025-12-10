import { Field, ObjectType } from '@nestjs/graphql'
import { Referral } from './referrals.model'

@ObjectType('HealthDirectorateReferralDetail')
export class ReferralDetail {
  @Field(() => Referral, { nullable: true })
  data?: Referral
}
