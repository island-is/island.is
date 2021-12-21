import { Field, InputType, registerEnumType } from '@nestjs/graphql'

import { Role } from '../auth'

export const { citizen, ...AccessControlRole} = Role;
type excludeOptions = typeof Role.citizen;
type AccessControlRole = Exclude<Role, excludeOptions>
registerEnumType(AccessControlRole, {name: 'AccessControlRole'})

@InputType()
export class CreateAccessControlInput {
  @Field()
  nationalId!: string

  @Field()
  name!: string

  @Field(() => AccessControlRole)
  role!: AccessControlRole

  @Field({ nullable: true })
  partnerId?: string
}

@InputType()
export class UpdateAccessControlInput {
  @Field()
  nationalId!: string

  @Field()
  name!: string

  @Field(() => AccessControlRole)
  role!: AccessControlRole

  @Field({ nullable: true })
  partnerId?: string
}

@InputType()
export class DeleteAccessControlInput {
  @Field()
  nationalId!: string
}
