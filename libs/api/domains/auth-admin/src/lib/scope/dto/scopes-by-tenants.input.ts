import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class ScopesByTenantsInput {
  @Field(() => [String], { nullable: false })
  tenantIds!: string[]
}
