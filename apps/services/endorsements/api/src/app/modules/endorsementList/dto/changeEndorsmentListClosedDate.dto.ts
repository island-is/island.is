import { ApiProperty } from '@nestjs/swagger'
import { IsDateString } from 'class-validator'
import { Type } from 'class-transformer';

export class ChangeEndorsmentListClosedDateDto {
  @ApiProperty({ type: String })
  @Type(() => Date)
  @IsDateString()
  closedDate!: Date

}
