import { Field, InputType } from '@nestjs/graphql'

import { AccessControlRole } from './accessControl.model'
import type { AccessControlRoleType } from './accessControl.model'

@InputType()
export class CreateAccessControlInput {
  @Field()
  nationalId!: string

  @Field()
  name!: string

  @Field(() => AccessControlRole)
  role!: AccessControlRoleType

  @Field({ nullable: true })
  partnerId?: string

  @Field()
  email?: string

  @Field()
  phone!: string
}

@InputType()
export class UpdateAccessControlInput {
  @Field()
  nationalId!: string

  @Field()
  name!: string

  @Field(() => AccessControlRole)
  role!: AccessControlRoleType

  @Field({ nullable: true })
  partnerId?: string

  @Field()
  email?: string

  @Field()
  phone!: string
}

@InputType()
export class DeleteAccessControlInput {
  @Field()
  nationalId!: string
}
