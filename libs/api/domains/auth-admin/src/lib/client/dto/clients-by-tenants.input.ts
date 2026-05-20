import { Field, InputType } from '@nestjs/graphql'

@InputType('AuthAdminClientsByTenantsInput')
export class ClientsByTenantsInput {
  @Field(() => [String], { nullable: false })
  tenantIds!: string[]
}
