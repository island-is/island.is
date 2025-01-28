import { Field, ObjectType, ID, registerEnumType } from '@nestjs/graphql'

export enum Role {
  developer = 'developer',
  recyclingCompany = 'recyclingCompany',
  recyclingCompanyAdmin = 'recyclingCompanyAdmin',
  recyclingFund = 'recyclingFund',
  citizen = 'citizen',
  municipality = 'municipality',
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

  @Field({ nullable: true })
  partnerId?: string
}
