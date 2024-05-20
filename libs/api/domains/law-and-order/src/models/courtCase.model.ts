import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType('LawAndOrderCourtCaseTexts')
export class Texts {
  @Field(() => String, { nullable: true })
  intro?: string

  @Field(() => String, { nullable: true })
  footnote?: string
}

@ObjectType('LawAndOrderCourtCaseActions')
export class Actions {
  @Field(() => String, { nullable: true })
  type?: 'file' | 'url' | 'inbox'

  @Field(() => String, { nullable: true })
  title?: string

  @Field(() => String, { nullable: true })
  data?: string
}

@ObjectType('LawAndOrderCourtCaseItemActions')
export class ItemActions {
  @Field(() => String, { nullable: true })
  label?: string

  @Field(() => String, { nullable: true })
  url?: string

  @Field(() => String, { nullable: true })
  type?: string
}

@ObjectType('LawAndOrderCourtCaseItems')
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

@ObjectType('LawAndOrderCourtCaseGroups')
export class Groups {
  @Field(() => String, { nullable: true })
  label?: string

  @Field(() => [Items], { nullable: true })
  items?: Array<Items>
}

@ObjectType('LawAndOrderCourtCaseData')
export class Data {
  @Field(() => ID, { nullable: true })
  id?: string

  @Field(() => Boolean, { nullable: true })
  acknowledged?: boolean

  @Field(() => String, { nullable: true })
  caseNumber?: string

  @Field(() => String, { nullable: true })
  caseNumberTitle?: string

  @Field(() => [Groups], { nullable: true })
  groups?: Array<Groups>
}

@ObjectType('LawAndOrderCourtCase')
export class CourtCase {
  @Field(() => Texts, { nullable: true })
  texts?: Texts

  @Field(() => [Actions], { nullable: true })
  actions?: Array<Actions>

  @Field(() => Data, { nullable: true })
  data?: Data
}
