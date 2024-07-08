import { IsBoolean, IsNotEmpty } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

import { DeliverDto } from './deliver.dto'

export class DeliverCancellationNoticeDto extends DeliverDto {
  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({ type: Boolean })
  readonly withCourtCaseNumber!: boolean
}
