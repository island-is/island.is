import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean } from 'class-validator'

export class CancelBankTransferResponse {
  @IsBoolean()
  @ApiProperty()
  readonly ok!: boolean
}
