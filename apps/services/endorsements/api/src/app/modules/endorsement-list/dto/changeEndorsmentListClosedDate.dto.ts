import { ApiProperty } from '@nestjs/swagger'
import { IsDate } from 'class-validator'
import { Type } from 'class-transformer'

export class ChangeEndorsmentListClosedDateDto {
  @ApiProperty({ type: Date })
  @Type(() => Date)
  @IsDate()
  closedDate!: Date
}
