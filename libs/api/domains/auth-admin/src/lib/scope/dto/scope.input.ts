import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class ScopeInput {
  @Field(() => String, { nullable: false })
  tenantId!: string

  @Field(() => String, { nullable: false })
  scopeName!: string
}
