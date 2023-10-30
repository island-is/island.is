import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class ConfirmationDtoResponse {
  @ApiProperty()
  readonly confirmed!: boolean

  @ApiProperty()
  readonly message!: string

  @ApiPropertyOptional()
  remainingAttempts?: number
}
