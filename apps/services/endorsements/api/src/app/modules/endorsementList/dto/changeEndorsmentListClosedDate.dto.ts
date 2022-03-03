import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsDate } from 'class-validator'

export class ChangeEndorsmentListClosedDateDto {
  @ApiProperty({ type: Date })
  @Type(() => Date)
  @IsDate()
  closedDate!: Date
}
