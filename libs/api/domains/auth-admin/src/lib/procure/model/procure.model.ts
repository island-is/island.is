import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('AuthAdminProcure')
export class Procure {
  @Field(() => String)
  name!: string

  @Field(() => String)
  nationalId!: string
}
