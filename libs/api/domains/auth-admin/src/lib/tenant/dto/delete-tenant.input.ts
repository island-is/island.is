import { Field, InputType } from '@nestjs/graphql'

@InputType('DeleteAuthAdminTenantInput')
export class DeleteTenantInput {
  @Field(() => String)
  tenantId!: string
}
