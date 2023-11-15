import { InputType, Field } from '@nestjs/graphql'

@InputType()
export class ConfirmOwnerChange {
  @Field({ nullable: true })
  id?: string

  @Field({ nullable: true })
  machineId?: string

  @Field({ nullable: true })
  machineMoreInfo?: string

  @Field({ nullable: true })
  machinePostalCode?: number

  @Field({ nullable: true })
  buyerNationalId?: string

  @Field({ nullable: true })
  delegateNationalId?: string

  @Field({ nullable: true })
  supervisorNationalId?: string

  @Field({ nullable: true })
  supervisorEmail?: string

  @Field({ nullable: true })
  supervisorPhoneNumber?: string

  @Field({ nullable: true })
  machineAddress?: string
}
