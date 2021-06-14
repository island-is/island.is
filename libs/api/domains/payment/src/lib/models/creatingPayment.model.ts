import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class CreatingPaymentModel {
  @Field(() => String)
  user4!: string

  @Field(() => String)
  receptionID!: string
}
