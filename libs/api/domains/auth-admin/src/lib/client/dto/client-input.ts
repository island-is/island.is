import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class ClientInput {
  @Field(() => String, { nullable: false })
  tenantId!: string
  @Field(() => String, { nullable: false })
  clientId!: string
}
