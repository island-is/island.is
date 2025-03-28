import { Field, InputType, Int, ObjectType } from '@nestjs/graphql'

@InputType()
@ObjectType('GetBloodDonationRestrictionsInputModel')
export class GetBloodDonationRestrictionsInput {
  @Field(() => Int, { nullable: true })
  page?: number

  @Field(() => String)
  lang = 'is-IS'
}

@InputType()
export class GetBloodDonationRestrictionDetailsInput {
  @Field(() => String)
  id!: string

  @Field(() => String)
  lang = 'is-IS'
}
