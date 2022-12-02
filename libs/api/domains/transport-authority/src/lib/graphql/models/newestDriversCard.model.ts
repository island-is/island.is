import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class NewestDriversCard {
  @Field()
  applicationCreatedAt?: Date

  @Field()
  cardNumber?: string

  @Field()
  cardValidFrom?: Date

  @Field()
  cardValidTo?: Date

  @Field()
  isValid?: boolean
}
