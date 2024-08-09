import { Field, ID, ObjectType } from '@nestjs/graphql'

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

@ObjectType('LawAndOrderSubpoenaActions')
export class Actions {
  @Field({ nullable: true })
  type?: 'file' | 'url' | 'inbox'

  @Field({ nullable: true })
  title?: string

  @Field({ nullable: true })
  data?: string
}

@ObjectType('LawAndOrderSubpoenaItemActions')
export class ItemActions {
  @Field({ nullable: true })
  label?: string

  @Field({ nullable: true })
  url?: string

  @Field({ nullable: true })
  type?: string
}

@ObjectType('LawAndOrderSubpoenaItems')
export class Items {
  @Field({ nullable: true })
  label?: string

  @Field({ nullable: true })
  value?: string

  @Field({ nullable: true })
  link?: string

  @Field(() => ItemActions, { nullable: true })
  action?: ItemActions
}

@ObjectType('LawAndOrderSubpoenaGroups')
export class Groups {
  @Field({ nullable: true })
  label?: string

  @Field(() => [Items], { nullable: true })
  items?: Array<Items>
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

  @Field(() => [Groups], { nullable: true })
  groups?: Array<Groups>
}

@ObjectType('LawAndOrderSubpoena')
export class Subpoena {
  @Field({ nullable: true })
  texts?: Texts

  @Field(() => [Actions], { nullable: true })
  actions?: Array<Actions>

  @Field(() => Data, { nullable: true })
  data?: Data
}
