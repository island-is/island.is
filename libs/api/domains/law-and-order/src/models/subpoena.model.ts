import { Field, ID, ObjectType } from '@nestjs/graphql'
import { Action } from './actions.model'
import { Group } from './group.model'
import { DefenseChoiceEnum } from './defenseChoiceEnum.model'

@ObjectType('LawAndOrderSubpoenaTexts')
export class Text {
  @Field({ nullable: true })
  intro?: string

  @Field({ nullable: true })
  confirmation?: string

  @Field({ nullable: true })
  description?: string

  @Field({ nullable: true })
  claim?: string
}

@ObjectType('LawAndOrderSubpoenaData')
export class Data {
  @Field(() => ID)
  id!: string

  @Field({ nullable: true })
  acknowledged?: boolean

  @Field({ nullable: true })
  chosenDefender?: string

  @Field(() => DefenseChoiceEnum, { nullable: true })
  defenderChoice?: DefenseChoiceEnum

  @Field(() => [Group], { nullable: true })
  groups?: Array<Group>
}

@ObjectType('LawAndOrderSubpoena')
export class Subpoena {
  @Field({ nullable: true })
  texts?: Text

  @Field(() => [Action], { nullable: true })
  actions?: Array<Action>

  @Field(() => Data, { nullable: true })
  data?: Data
}
