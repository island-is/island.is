import { Field, ID, ObjectType } from '@nestjs/graphql'
import { Action } from './actions.model'
import { Group } from './group.model'

@ObjectType('LawAndOrderSubpoenaTexts')
export class Texts {
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

  @Field({ nullable: true })
  defenderChoice?: string

  @Field(() => [Group], { nullable: true })
  groups?: Array<Group>
}

@ObjectType('LawAndOrderSubpoena')
export class Subpoena {
  @Field({ nullable: true })
  texts?: Texts

  @Field(() => [Action], { nullable: true })
  actions?: Array<Action>

  @Field(() => Data, { nullable: true })
  data?: Data
}
