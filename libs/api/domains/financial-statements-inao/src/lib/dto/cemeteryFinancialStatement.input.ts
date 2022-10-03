import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'
import { InaoCemeteryFinancialStatementValuesInput } from './cemeteryFinancialStatemetnValues.input'

@InputType()
export class InaoCemeteryFinancialStatementInput {
  @Field(() => String)
  @IsString()
  year!: string

  @Field(() => String)
  @IsString()
  comment!: string

  @Field(() => InaoCemeteryFinancialStatementValuesInput)
  values!: InaoCemeteryFinancialStatementValuesInput
}
