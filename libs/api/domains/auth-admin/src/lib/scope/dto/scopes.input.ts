import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class ScopesInput {
  @Field(() => String, { nullable: false })
  tenantId!: string
}
