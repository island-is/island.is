import { InputType, Field } from '@nestjs/graphql'

@InputType()
export class ChangeMachineSupervisor {
  @Field({ nullable: true })
  machineId?: string

  @Field({ nullable: true })
  delegateNationalId?: string

  @Field({ nullable: true })
  ownerNationalId?: string

  @Field({ nullable: true })
  supervisorNationalId?: string

  @Field({ nullable: true })
  email?: string

  @Field({ nullable: true })
  phoneNumber?: string

  @Field({ nullable: true })
  address?: string

  @Field(() => Number, { nullable: true })
  postalCode?: number

  @Field({ nullable: true })
  moreInfo?: string
}
