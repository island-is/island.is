import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('AuthAdminApplicationLifeTime')
export class ApplicationLifeTime {
  @Field(() => Number)
  absoluteLifeTime!: number

  @Field(() => Boolean)
  inactivityExpiration!: boolean

  @Field(() => Number)
  inactivityLifeTime!: number
}
