import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class ClientsInput {
  @Field(() => String)
  tenantId!: string
}
