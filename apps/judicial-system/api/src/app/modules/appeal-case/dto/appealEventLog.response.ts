import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql'

import {
  AppealEventType,
  AppealOrigin,
  UserRole,
} from '@island.is/judicial-system/types'

registerEnumType(AppealOrigin, { name: 'AppealOrigin' })

// One entry of an appeal case's event log. Exposed so the web can tell who
// appealed a verdict, and when, per defendant - a verdict appeal can have several
// appellants, which the single appealedBy* fields on AppealCase cannot carry.
@ObjectType()
export class AppealEventLog {
  @Field(() => ID)
  readonly id!: string

  @Field(() => String, { nullable: true })
  readonly created?: string

  @Field(() => AppealEventType, { nullable: true })
  readonly eventType?: AppealEventType

  @Field(() => AppealOrigin, { nullable: true })
  readonly appealOrigin?: AppealOrigin

  @Field(() => ID, { nullable: true })
  readonly defendantId?: string

  @Field(() => ID, { nullable: true })
  readonly civilClaimantId?: string

  @Field(() => UserRole, { nullable: true })
  readonly userRole?: UserRole

  @Field(() => String, { nullable: true })
  readonly userName?: string

  @Field(() => String, { nullable: true })
  readonly userTitle?: string

  @Field(() => String, { nullable: true })
  readonly institutionName?: string
}
