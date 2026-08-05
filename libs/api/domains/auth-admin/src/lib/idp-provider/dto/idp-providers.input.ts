import { Field, InputType, Int } from '@nestjs/graphql'

@InputType('AuthAdminIdpProvidersInput')
export class IdpProvidersInput {
  @Field(() => String, { nullable: true })
  searchString?: string

  @Field(() => Int)
  page!: number

  @Field(() => Int)
  count!: number
}
