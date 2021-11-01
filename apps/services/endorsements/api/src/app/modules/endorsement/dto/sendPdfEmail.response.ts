import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean } from 'class-validator'

export class sendPdfEmailResponse {
  @ApiProperty()
  @IsBoolean()
  success!: boolean
}
