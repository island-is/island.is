import { Field, ObjectType, ID, registerEnumType } from '@nestjs/graphql'

import { Role } from '../auth'

registerEnumType(Role, { name: 'Role' })

@ObjectType()
export class User {
  @Field((_1) => ID)
  nationalId: string

  @Field()
  name: string

  @Field({ nullable: true })
  mobile?: string

  @Field(() => Role, { nullable: true })
  role?: Role

  @Field({ nullable: true })
  partnerId?: string
}
