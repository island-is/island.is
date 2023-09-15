import { Field, ID, ObjectType } from '@nestjs/graphql'
import { IPrice } from '../generated/contentfulTypes'

@ObjectType()
export class Price {
  @Field(() => ID)
  id!: string

  @Field()
  amount!: number
}

export const mapPrice = ({ sys, fields }: IPrice): Price => {
  return {
    id: sys.id,
    amount: fields.amount,
  }
}
