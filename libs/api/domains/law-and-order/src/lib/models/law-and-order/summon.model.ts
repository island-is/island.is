import { Field, ID, ObjectType } from '@nestjs/graphql'
import { Action } from './actions.model'
import { DefenseChoiceEnum } from './defenseChoiceEnum.model'
import { Group } from './group.model'

@ObjectType('LawAndOrderSubpoenaTexts')
export class Text {
  @Field({ nullable: true })
  confirmation?: string

  @Field({ nullable: true })
  description?: string

  @Field({ nullable: true })
  information?: string

  @Field({ nullable: true })
  deadline?: string
}

@ObjectType('LawAndOrderSubpoenaData')
export class Data {
  @Field(() => ID)
  cacheId!: string

  @Field()
  id!: string

  @Field({ nullable: true })
  hasBeenServed?: boolean

  @Field({ nullable: true })
  chosenDefender?: string

  @Field(() => Boolean, { nullable: true })
  canEditDefenderChoice?: boolean

  @Field({ nullable: true })
  courtContactInfo?: string

  @Field(() => DefenseChoiceEnum)
  defaultChoice!: DefenseChoiceEnum

  @Field(() => Boolean, { nullable: true })
  hasChosen?: boolean

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
