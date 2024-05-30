import { Field, ID, Int, ObjectType, registerEnumType } from '@nestjs/graphql'

import { UserRole } from '@island.is/judicial-system/types'

import { Institution } from '../../institution'

registerEnumType(UserRole, { name: 'UserRole' })

@ObjectType()
export class User {
  @Field(() => ID)
  readonly id!: string

  @Field(() => String, { nullable: true })
  readonly created?: string

  @Field(() => String, { nullable: true })
  readonly modified?: string

  @Field(() => String, { nullable: true })
  readonly nationalId?: string

  @Field(() => String, { nullable: true })
  readonly name?: string

  @Field(() => String, { nullable: true })
  readonly title?: string

  @Field(() => String, { nullable: true })
  readonly mobileNumber?: string

  @Field(() => UserRole, { nullable: true })
  readonly role?: UserRole

  @Field(() => String, { nullable: true })
  readonly email?: string

  @Field(() => Institution, { nullable: true })
  readonly institution?: Institution

  @Field(() => Boolean, { nullable: true })
  readonly active?: boolean

  @Field(() => String, { nullable: true })
  readonly latestLogin?: string

  @Field(() => Int, { nullable: true })
  readonly loginCount?: number

  @Field(() => Boolean, { nullable: true })
  readonly canConfirmIndictment?: boolean
}
