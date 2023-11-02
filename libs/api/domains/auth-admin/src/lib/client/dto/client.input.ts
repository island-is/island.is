import { Field, InputType } from '@nestjs/graphql'

@InputType('AuthAdminClientInput')
export class ClientInput {
  @Field(() => String, { nullable: false })
  tenantId!: string

  @Field(() => String, { nullable: false })
  clientId!: string

  @Field(() => Boolean, { nullable: true })
  includeArchived?: boolean
}
