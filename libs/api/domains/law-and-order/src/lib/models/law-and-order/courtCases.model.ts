import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql'

export enum CourtCaseStateTagColorEnum {
  blue = 'blue',
  darkerBlue = 'darkerBlue',
  purple = 'purple',
  white = 'white',
  red = 'red',
  rose = 'rose',
  blueberry = 'blueberry',
  dark = 'dark',
  mint = 'mint',
  yellow = 'yellow',
  disabled = 'disabled',
  warn = 'warn',
}
registerEnumType(CourtCaseStateTagColorEnum, {
  name: 'LawAndOrderCourtCaseStateTagColorEnum',
})

@ObjectType('LawAndOrderCourtCasesState')
export class State {
  @Field({ nullable: true })
  label?: string

  @Field(() => CourtCaseStateTagColorEnum, { nullable: true })
  color?: CourtCaseStateTagColorEnum
}

@ObjectType('LawAndOrderCourtCasesCase')
export class Case {
  @Field(() => ID)
  cacheId!: string

  @Field()
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
