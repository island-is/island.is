import { Allow, IsNotEmpty, IsString } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

import { FileAppealStatementInput } from './fileAppealStatement.input'

// A deadline is a party and a date: the party the way every statement
// request names it, and the day it has to file by.
@InputType()
export class SetAppealStatementDeadlineInput extends FileAppealStatementInput {
  @Allow()
  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  readonly deadline!: string
}
