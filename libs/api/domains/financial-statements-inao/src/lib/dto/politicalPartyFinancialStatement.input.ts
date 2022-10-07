import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'
import { InaoPoliticalPartyFinancialStatementValuesInput } from './politicalPartyFinancialStatementValues.input'

@InputType()
export class InaoPoliticalPartyFinancialStatementInput {
  @Field(() => String)
  @IsString()
  year!: string

  @Field(() => String)
  @IsString()
  comment!: string

  @Field(() => InaoPoliticalPartyFinancialStatementValuesInput)
  values!: InaoPoliticalPartyFinancialStatementValuesInput
}
