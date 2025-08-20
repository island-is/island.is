import { Field, ID, ObjectType } from '@nestjs/graphql'
import { Action } from './actions.model'
import { Group } from './group.model'

@ObjectType('LawAndOrderCourtCaseText')
export class Text {
  @Field({ nullable: true })
  intro?: string

  @Field({ nullable: true })
  footnote?: string
}

@ObjectType('LawAndOrderCourtCaseData')
export class Data {
  @Field(() => ID)
  id!: string

  @Field({ nullable: true })
  caseNumberTitle?: string

  @Field({ nullable: true })
  hasSubpoenaBeenServed?: boolean

  @Field({ nullable: true })
  hasVerdictBeenServed?: boolean

  @Field({ nullable: true })
  hasVerdict?: boolean

  @Field(() => [Group], { nullable: true })
  groups?: Array<Group>
}

@ObjectType('LawAndOrderCourtCase')
export class CourtCase {
  @Field(() => Text, { nullable: true })
  texts?: Text

  @Field(() => [Action], { nullable: true })
  actions?: Array<Action>

  @Field(() => Data, { nullable: true })
  data?: Data
}
