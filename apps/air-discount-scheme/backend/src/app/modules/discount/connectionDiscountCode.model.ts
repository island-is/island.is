import { ApiProperty } from "@nestjs/swagger"

export class ConnectionDiscountCode {
  @ApiProperty()
  code!: string

  @ApiProperty()
  flightId!: string

  @ApiProperty()
  flightDesc!: string

  @ApiProperty()
  validUntil!: string
}
