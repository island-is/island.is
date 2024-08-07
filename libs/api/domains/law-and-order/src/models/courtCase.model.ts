import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType('LawAndOrderCourtCaseTexts')
export class Texts {
  @Field({ nullable: true })
  intro?: string

  @Field({ nullable: true })
  footnote?: string
}

@ObjectType('LawAndOrderCourtCaseActions')
export class Actions {
  @Field({ nullable: true })
  type?: 'file' | 'url' | 'inbox'

  @Field({ nullable: true })
  title?: string

  @Field({ nullable: true })
  data?: string
}

@ObjectType('LawAndOrderCourtCaseItemActions')
export class ItemActions {
  @Field({ nullable: true })
  label?: string

  @Field({ nullable: true })
  url?: string

  @Field({ nullable: true })
  type?: string
}

@ObjectType('LawAndOrderCourtCaseItems')
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

@ObjectType('LawAndOrderCourtCaseGroups')
export class Groups {
  @Field({ nullable: true })
  label?: string

  @Field(() => [Items], { nullable: true })
  items?: Array<Items>
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
