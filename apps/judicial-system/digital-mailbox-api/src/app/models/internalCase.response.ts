import { ApiProperty } from '@nestjs/swagger'

export class InternalCaseResponse {
  @ApiProperty({ type: String })
  courtCaseNumber!: string
}
