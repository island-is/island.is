import { ApiProperty } from '@nestjs/swagger'

export class ConfirmationDtoResponse {
  @ApiProperty()
  readonly confirmed!: boolean

  @ApiProperty()
  readonly message!: string
}
