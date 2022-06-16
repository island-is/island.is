import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('FinancialStatementsInaoElection')
export class Election {
  @Field()
  electionId!: string

  @Field()
  name!: string

  @Field(() => Date)
  electionDate!: Date
}
