import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('AuthAdminApplicationUrl')
export class ApplicationUrl {
  @Field(() => [String])
  callbackUrls!: string[]

  @Field(() => [String])
  logoutUrls!: string[]

  @Field(() => [String])
  cors!: string[]
}
