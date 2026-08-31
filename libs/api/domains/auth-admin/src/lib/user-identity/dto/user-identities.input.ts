import { Field, InputType } from '@nestjs/graphql'

@InputType('AuthAdminUserIdentitiesInput')
export class UserIdentitiesInput {
  @Field(() => String)
  searchString!: string
}
