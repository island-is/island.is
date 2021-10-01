import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class ChangeEndorsmentListClosedDateDto {
  @ApiProperty({ type: String })
  @IsString()
  closedDate!: string
}
