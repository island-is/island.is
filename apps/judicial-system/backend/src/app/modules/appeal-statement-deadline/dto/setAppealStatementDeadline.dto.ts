import { Type } from 'class-transformer'
import { IsDate } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

import { FileAppealStatementDto } from './fileAppealStatement.dto'

// A deadline is a party and a date: the party the way every statement
// request names it, and the day it has to file by.
export class SetAppealStatementDeadlineDto extends FileAppealStatementDto {
  @Type(() => Date)
  @IsDate()
  @ApiProperty({ type: Date })
  readonly deadline!: Date
}
