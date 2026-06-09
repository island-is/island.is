import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class CustomsGeneralProcessingFee {
  @Field(() => String)
  tariffNumber!: string

  @Field(() => String)
  plRatio!: string

  @Field(() => String)
  ppRatio!: string

  @Field(() => Date)
  validFrom!: Date

  @Field(() => Date)
  validTo!: Date
}
