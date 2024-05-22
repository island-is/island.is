import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType('LawAndOrderSubpoenaTexts')
export class Texts {
  @Field(() => String, { nullable: true })
  intro?: string

  @Field(() => String, { nullable: true })
  confirmation?: string

  @Field(() => String, { nullable: true })
  description?: string

  @Field(() => String, { nullable: true })
  claim?: string
}

@ObjectType('LawAndOrderSubpoenaActions')
export class Actions {
  @Field(() => String, { nullable: true })
  type?: 'file' | 'url' | 'inbox'

  @Field(() => String, { nullable: true })
  title?: string

  @Field(() => String, { nullable: true })
  data?: string
}

@ObjectType('LawAndOrderSubpoenaItemActions')
export class ItemActions {
  @Field(() => String, { nullable: true })
  label?: string

  @Field(() => String, { nullable: true })
  url?: string

  @Field(() => String, { nullable: true })
  type?: string
}

@ObjectType('LawAndOrderSubpoenaItems')
export class Items {
  @Field(() => String, { nullable: true })
  label?: string

  @Field(() => String, { nullable: true })
  value?: string

  @Field(() => String, { nullable: true })
  link?: string

  @Field(() => ItemActions, { nullable: true })
  action?: ItemActions
}

@ObjectType('LawAndOrderSubpoenaGroups')
export class Groups {
  @Field(() => String, { nullable: true })
  label?: string

  @Field(() => [Items], { nullable: true })
  items?: Array<Items>
}

@ObjectType('LawAndOrderSubpoenaData')
export class Data {
  @Field(() => ID)
  id!: string

  @Field(() => Boolean, { nullable: true })
  acknowledged?: boolean

  @Field(() => Boolean, { nullable: true })
  displayClaim?: boolean

  @Field(() => String, { nullable: true })
  chosenDefender?: string

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
