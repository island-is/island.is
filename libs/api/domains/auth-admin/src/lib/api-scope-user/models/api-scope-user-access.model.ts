import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('AuthAdminApiScopeUserAccess')
export class ApiScopeUserAccess {
  @Field(() => String)
  nationalId!: string

  @Field(() => String)
  scope!: string
}
