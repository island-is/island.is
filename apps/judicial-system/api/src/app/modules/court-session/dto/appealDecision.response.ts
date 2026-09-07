import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql'

import {
  AppealDecisionPartyRole,
  CaseAppealDecision,
} from '@island.is/judicial-system/types'

registerEnumType(AppealDecisionPartyRole, {
  name: 'AppealDecisionPartyRole',
})

// CaseAppealDecision is registered by the Case model.

@ObjectType()
export class AppealDecisionResponse {
  @Field(() => ID)
  readonly id!: string

  @Field(() => String, { nullable: true })
  readonly created?: string

  @Field(() => String, { nullable: true })
  readonly modified?: string

  @Field(() => ID, { nullable: true })
  readonly caseId?: string

  @Field(() => ID, { nullable: true })
  readonly rulingFileId?: string

  @Field(() => AppealDecisionPartyRole, { nullable: true })
  readonly partyRole?: AppealDecisionPartyRole

  @Field(() => ID, { nullable: true })
  readonly defendantId?: string

  @Field(() => ID, { nullable: true })
  readonly civilClaimantId?: string

  @Field(() => CaseAppealDecision, { nullable: true })
  readonly decision?: CaseAppealDecision

  @Field(() => String, { nullable: true })
  readonly announcement?: string

  @Field(() => String, { nullable: true })
  readonly withdrawnDate?: string
}
