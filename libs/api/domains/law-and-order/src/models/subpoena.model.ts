import { Field, ID, ObjectType } from '@nestjs/graphql'
import { Action } from './actions.model'
import { Group } from './group.model'
import { DefenseChoiceEnum } from './defenseChoiceEnum.model'

@ObjectType('LawAndOrderSubpoenaAlert')
export class Alert {
  @Field({ nullable: true })
  type?: string

  @Field({ nullable: true })
  message?: string
}
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
  hasBeenServed?: boolean

  @Field({ nullable: true })
  chosenDefender?: string

  @Field(() => DefenseChoiceEnum, { nullable: true })
  defenderChoice?: DefenseChoiceEnum

  @Field(() => [Group], { nullable: true })
  groups?: Array<Group>

  @Field(() => [Alert], { nullable: true })
  alerts?: Array<Alert>
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
