import {
  ObjectType,
  Field,
  Int,
  GraphQLISODateTime,
  Float,
} from '@nestjs/graphql'

@ObjectType('FarmerLandBeneficiaryPayment')
export class LandBeneficiaryPayment {
  @Field(() => Int)
  categoryId!: number

  @Field({ nullable: true })
  category?: string

  @Field(() => Float, {
    nullable: true,
    description: 'Percentage of land share',
  })
  share?: number

  @Field({ nullable: true })
  blocked?: boolean

  @Field({ nullable: true })
  operating?: boolean

  @Field(() => GraphQLISODateTime, { nullable: true })
  dateFrom?: Date

  @Field(() => GraphQLISODateTime, { nullable: true })
  dateTo?: Date
}
