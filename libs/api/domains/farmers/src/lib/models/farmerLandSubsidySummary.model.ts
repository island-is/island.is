import { Field, Float, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class FarmerLandSubsidySummary {
  @Field(() => Float, {
    nullable: true,
    description: 'Total gross amount before debt settlement across the result set',
  })
  grossAmount?: number

  @Field(() => Float, {
    nullable: true,
    description: 'Total net amount paid out after offsets across the result set',
  })
  netPaid?: number

  @Field(() => Float, {
    nullable: true,
    description: 'Total debt settlement offset applied across the result set',
  })
  offset?: number
}
