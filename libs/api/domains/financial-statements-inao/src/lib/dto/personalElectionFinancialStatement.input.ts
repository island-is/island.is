import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'
import { InaoPersonalElectionFinancialStatementValuesInput } from './personalElectionFinancialStatementValues.input'

@InputType()
export class InaoPersonalElectionFinancialStatementInput {
  @Field(() => String)
  @IsString()
  electionId!: string

  @Field(() => String)
  @IsString()
  clientName!: string

  @Field(() => Boolean)
  noValueStatement!: boolean

  @Field(() => InaoPersonalElectionFinancialStatementValuesInput, {
    nullable: true,
  })
  values?: InaoPersonalElectionFinancialStatementValuesInput
}
