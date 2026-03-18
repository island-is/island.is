import { Field, Float, GraphQLISODateTime, ID, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class FarmerLandSubsidy {
  // TODO: Replace with a stable ID from the API when available
  @Field(() => ID)
  id!: string

  @Field(() => GraphQLISODateTime, { nullable: true })
  paymentDate?: Date

  @Field({ nullable: true, description: 'National ID of the payment recipient' })
  nationalId?: string

  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true, description: 'Contract identifier' })
  contractId?: string

  @Field({ nullable: true })
  contract?: string

  @Field(() => Int, { nullable: true })
  paymentCategoryId?: number

  @Field({ nullable: true })
  paymentCategory?: string

  @Field(() => Float, { nullable: true, description: 'Price per unit' })
  unitPrice?: number

  @Field(() => Float, { nullable: true, description: 'Number of units' })
  units?: number

  @Field(() => Float, { nullable: true, description: 'Gross amount before debt settlement' })
  grossAmount?: number

  @Field(() => Float, { nullable: true, description: 'Net amount paid out after offsets' })
  netPaid?: number

  @Field(() => Float, { nullable: true, description: 'Debt settlement offset applied to gross amount' })
  offset?: number
}
