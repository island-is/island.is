import { Field, ID, ObjectType } from '@nestjs/graphql'
import { Action } from './actions.model'
import { Group } from './group.model'

@ObjectType('LawAndOrderCourtCaseTexts')
export class Texts {
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
  acknowledged?: boolean

  @Field({ nullable: true })
  caseNumber?: string

  @Field({ nullable: true })
  caseNumberTitle?: string

  @Field(() => [Group], { nullable: true })
  groups?: Array<Group>
}

@ObjectType('LawAndOrderCourtCase')
export class CourtCase {
  @Field(() => Texts, { nullable: true })
  texts?: Texts

  @Field(() => [Action], { nullable: true })
  actions?: Array<Action>

  @Field(() => Data, { nullable: true })
  data?: Data
}
