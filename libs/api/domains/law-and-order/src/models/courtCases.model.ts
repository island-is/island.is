import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType('LawAndOrderCourtCasesState')
export class State {
  @Field(() => String, { nullable: true })
  title?: string

  @Field(() => String, { nullable: true })
  date?: string

  @Field(() => String, { nullable: true })
  theme?: string
}

@ObjectType('LawAndOrderCourtCasesCase')
export class Case {
  @Field(() => ID, { nullable: true })
  id?: string

  @Field(() => String, { nullable: true })
  caseNumber?: string

  @Field(() => String, { nullable: true })
  caseNumberTitle?: string

  @Field(() => String, { nullable: true })
  type?: string

  @Field(() => State, { nullable: true })
  state?: State

  @Field(() => Boolean, { nullable: true })
  acknowledged?: boolean
}

@ObjectType('LawAndOrderCourtCases')
export class CourtCases {
  @Field(() => [Case], { nullable: true })
  items?: Array<Case>
}
