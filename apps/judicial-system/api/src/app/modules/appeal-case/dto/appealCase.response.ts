import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql'

import {
  AppealCaseRulingDecision,
  AppealCaseState,
  UserRole,
} from '@island.is/judicial-system/types'

import { User } from '../../user'

registerEnumType(AppealCaseState, { name: 'AppealCaseState' })
registerEnumType(AppealCaseRulingDecision, { name: 'AppealCaseRulingDecision' })

@ObjectType()
export class AppealCase {
  @Field(() => ID)
  readonly id!: string

  @Field(() => String, { nullable: true })
  readonly created?: string

  @Field(() => String, { nullable: true })
  readonly modified?: string

  @Field(() => AppealCaseState, { nullable: true })
  readonly appealState?: AppealCaseState

  @Field(() => String, { nullable: true })
  readonly appealCaseNumber?: string

  @Field(() => String, { nullable: true })
  readonly appealReceivedByCourtDate?: string

  @Field(() => String, { nullable: true })
  readonly prosecutorStatementDate?: string

  @Field(() => String, { nullable: true })
  readonly defendantStatementDate?: string

  @Field(() => User, { nullable: true })
  readonly appealAssistant?: User

  @Field(() => User, { nullable: true })
  readonly appealJudge1?: User

  @Field(() => User, { nullable: true })
  readonly appealJudge2?: User

  @Field(() => User, { nullable: true })
  readonly appealJudge3?: User

  @Field(() => AppealCaseRulingDecision, { nullable: true })
  readonly appealRulingDecision?: AppealCaseRulingDecision

  @Field(() => String, { nullable: true })
  readonly appealConclusion?: string

  @Field(() => String, { nullable: true })
  readonly appealRulingModifiedHistory?: string

  @Field(() => [UserRole], { nullable: true })
  readonly requestAppealRulingNotToBePublished?: UserRole[]

  @Field(() => String, { nullable: true })
  readonly appealValidToDate?: string

  @Field(() => Boolean, { nullable: true })
  readonly isAppealCustodyIsolation?: boolean

  @Field(() => String, { nullable: true })
  readonly appealIsolationToDate?: string

  @Field(() => String, { nullable: true })
  readonly appealedByNationalId?: string
}
