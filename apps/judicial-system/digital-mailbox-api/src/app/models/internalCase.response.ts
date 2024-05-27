import { ApiProperty } from '@nestjs/swagger'

export class InternalCaseResponse {
  @ApiProperty({ type: String })
  courtCaseNumber!: string

  @ApiProperty({ type: Object })
  defendants!: { name: string; nationalId: string; address: string }[] // TODO: Better types
}
