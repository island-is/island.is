import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql'

import { RequestSharedWhen } from '@island.is/judicial-system/types'

registerEnumType(RequestSharedWhen, {
  name: 'RequestSharedWhen',
})
@ObjectType()
export class Victim {
  @Field(() => ID)
  readonly id!: string

  @Field(() => String, { nullable: true })
  readonly created?: string

  @Field(() => String, { nullable: true })
  readonly modified?: string

  @Field(() => ID, { nullable: true })
  readonly caseId!: string

  @Field(() => String, { nullable: true })
  readonly name?: string

  @Field(() => Boolean, { nullable: true })
  readonly hasNationalId?: boolean

  @Field(() => String, { nullable: true })
  readonly nationalId?: string

  @Field(() => Boolean, { nullable: true })
  readonly hasLawyer?: boolean

  @Field(() => String, { nullable: true })
  readonly lawyerNationalId?: string

  @Field(() => String, { nullable: true })
  readonly lawyerName?: string

  @Field(() => String, { nullable: true })
  readonly lawyerEmail?: string

  @Field(() => String, { nullable: true })
  readonly lawyerPhoneNumber?: string

  @Field(() => RequestSharedWhen, { nullable: true })
  readonly lawyerAccessToRequest?: RequestSharedWhen
}
