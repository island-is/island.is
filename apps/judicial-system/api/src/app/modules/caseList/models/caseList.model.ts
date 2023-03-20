import { Field, ObjectType, ID } from '@nestjs/graphql'

import type {
  CaseAppealDecision,
  CaseDecision,
  CaseListEntry as TCaseListEntry,
  CaseState,
  CaseType,
} from '@island.is/judicial-system/types'
import { Defendant } from '../../defendant'
import { User } from '../../user'

@ObjectType()
export class CaseListEntry implements TCaseListEntry {
  @Field(() => ID)
  readonly id!: string

  @Field()
  readonly created!: string

  @Field({ nullable: true })
  readonly courtDate?: string

  @Field(() => [String])
  readonly policeCaseNumbers!: string[]

  @Field(() => String)
  readonly state!: CaseState

  @Field(() => String)
  readonly type!: CaseType

  @Field(() => [Defendant], { nullable: true })
  readonly defendants?: Defendant[]

  @Field({ nullable: true })
  readonly courtCaseNumber?: string

  @Field(() => String, { nullable: true })
  readonly decision?: CaseDecision

  @Field({ nullable: true })
  readonly validToDate?: string

  @Field({ nullable: true })
  readonly isValidToDateInThePast?: boolean

  @Field({ nullable: true })
  readonly initialRulingDate?: string

  @Field({ nullable: true })
  readonly rulingDate?: string

  @Field({ nullable: true })
  readonly courtEndTime?: string

  @Field(() => String, { nullable: true })
  readonly prosecutorAppealDecision?: CaseAppealDecision

  @Field(() => String, { nullable: true })
  readonly accusedAppealDecision?: CaseAppealDecision

  @Field({ nullable: true })
  readonly accusedPostponedAppealDate?: string

  @Field({ nullable: true })
  readonly prosecutorPostponedAppealDate?: string

  @Field(() => User, { nullable: true })
  readonly creatingProsecutor?: User

  @Field(() => User, { nullable: true })
  readonly prosecutor?: User

  @Field(() => User, { nullable: true })
  readonly judge?: User

  @Field(() => User, { nullable: true })
  readonly registrar?: User

  @Field({ nullable: true })
  readonly parentCaseId?: string
}
