import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('AuthLoginRestriction')
export class LoginRestriction {
  @Field(() => Boolean)
  restricted!: boolean

  @Field(() => Date, { nullable: true })
  until?: Date
}
