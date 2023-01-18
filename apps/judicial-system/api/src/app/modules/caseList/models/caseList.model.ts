import { Field, ObjectType, ID, registerEnumType } from '@nestjs/graphql'

import {
  CaseAppealDecision,
  CaseDecision,
  CaseListEntry as TCaseListEntry,
  CaseState,
  CaseType,
} from '@island.is/judicial-system/types'
import { Defendant } from '../../defendant'
import { User } from '../../user'

registerEnumType(CaseType, { name: 'CaseType' })
registerEnumType(CaseState, { name: 'CaseState' })
registerEnumType(CaseDecision, { name: 'CaseDecision' })
registerEnumType(CaseAppealDecision, { name: 'CaseAppealDecision' })

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

  @Field(() => CaseState)
  readonly state!: CaseState

  @Field(() => CaseType)
  readonly type!: CaseType

  @Field(() => [Defendant], { nullable: true })
  readonly defendants?: Defendant[]

  @Field({ nullable: true })
  readonly courtCaseNumber?: string

  @Field(() => CaseDecision, { nullable: true })
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

  @Field(() => CaseAppealDecision, { nullable: true })
  readonly prosecutorAppealDecision?: CaseAppealDecision

  @Field(() => CaseAppealDecision, { nullable: true })
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
