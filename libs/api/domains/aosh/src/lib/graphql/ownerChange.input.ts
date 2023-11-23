import { InputType, Field } from '@nestjs/graphql'

@InputType()
export class ChangeMachineOwner {
  @Field({ nullable: true })
  id?: string

  @Field({ nullable: true })
  machineId?: string

  @Field({ nullable: true })
  buyerNationalId?: string

  @Field({ nullable: true })
  delegateNationalId?: string

  @Field({ nullable: true })
  sellerNationalId?: string

  @Field({ nullable: true })
  dateOfOwnerChange?: Date

  @Field({ nullable: true })
  paymentId?: string

  @Field({ nullable: true })
  phoneNumber?: string

  @Field({ nullable: true })
  email?: string
}
