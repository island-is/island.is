import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType('LawAndOrderCourtCasesState')
export class State {
  @Field({ nullable: true })
  label?: string

  @Field({ nullable: true })
  color?: string
}

@ObjectType('LawAndOrderCourtCasesCase')
export class Case {
  @Field(() => ID)
  id!: string

  @Field({ nullable: true })
  caseNumberTitle?: string

  @Field({ nullable: true })
  type?: string

  @Field(() => State, { nullable: true })
  state?: State
}

@ObjectType('LawAndOrderCourtCases')
export class CourtCases {
  @Field(() => [Case], { nullable: true })
  cases?: Array<Case>
}
