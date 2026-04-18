import { Field, InputType } from '@nestjs/graphql'

@InputType('DeleteAuthAdminApiScopeUserInput')
export class DeleteApiScopeUserInput {
  @Field(() => String)
  nationalId!: string
}
