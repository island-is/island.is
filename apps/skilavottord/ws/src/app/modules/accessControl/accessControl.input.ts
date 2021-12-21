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
