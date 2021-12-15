import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'

export class ChangeEndorsmentListClosedDateDto {
  @ApiProperty({ type: Date })
  @Type(() => Date)
  closedDate!: Date
}
