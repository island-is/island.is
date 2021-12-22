import { Field, ObjectType, ID, registerEnumType } from '@nestjs/graphql'

export enum Role {
  developer = 'developer',
  recyclingCompany = 'recyclingCompany',
  recyclingFund = 'recyclingFund',
  citizen = 'citizen',
}

registerEnumType(Role, { name: 'Role' })

@ObjectType('SkilavottordUser')
export class User {
  @Field((_) => ID)
  nationalId!: string

  @Field()
  name!: string

  @Field(() => Role)
  role!: Role
}
