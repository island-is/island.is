import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class CreatingPaymentModel {
  @Field()
  performingOrgID!: string
}