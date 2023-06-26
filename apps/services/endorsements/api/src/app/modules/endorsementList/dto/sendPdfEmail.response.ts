import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean } from 'class-validator'

export class SendPdfEmailResponse {
  @ApiProperty()
  @IsBoolean()
  success!: boolean
}
