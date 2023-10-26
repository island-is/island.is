import { InputType, Field } from '@nestjs/graphql'

@InputType()
export class ConfirmOwnerChange {
  @Field({ nullable: true })
  id?: string

  @Field({ nullable: true })
  machineId?: string
}
