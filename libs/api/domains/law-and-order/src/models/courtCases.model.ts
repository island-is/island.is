import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType('LawAndOrderCourtCasesState')
export class State {
  @Field({ nullable: true })
  title?: string

  @Field({ nullable: true })
  date?: string

  @Field({ nullable: true })
  theme?: string
}

@ObjectType('LawAndOrderCourtCasesCase')
export class Item {
  @Field(() => ID)
  id!: string

  @Field({ nullable: true })
  caseNumber?: string

  @Field({ nullable: true })
  caseNumberTitle?: string

  @Field({ nullable: true })
  type?: string

  @Field(() => State, { nullable: true })
  state?: State

  @Field({ nullable: true })
  acknowledged?: boolean
}

@ObjectType('LawAndOrderCourtCases')
export class CourtCases {
  @Field(() => [Item], { nullable: true })
  items?: Array<Item>
}
