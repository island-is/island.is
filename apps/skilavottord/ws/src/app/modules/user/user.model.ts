import { Field, ObjectType, ID, registerEnumType } from '@nestjs/graphql'

import { Role } from './user.types'

registerEnumType(Role, { name: 'Role' })

@ObjectType()
export class User {
  @Field(() => ID)
  nationalId: string

  @Field()
  name: string

  @Field({ nullable: true })
  mobile?: string

  @Field(() => Role)
  role: Role

  @Field({ nullable: true })
  partnerId?: string
}
