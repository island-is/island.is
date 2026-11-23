import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

/** A person's app login, as shown to them: no key material or SIM number. */
export class AppLoginDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  clientId!: string

  @ApiPropertyOptional({ nullable: true, type: String })
  clientName?: string | null

  @ApiProperty()
  platform!: string

  @ApiPropertyOptional({ nullable: true, type: String })
  deviceName?: string | null

  @ApiProperty()
  loginIdp!: string

  @ApiProperty()
  biometrics!: boolean

  @ApiProperty()
  created!: Date

  @ApiProperty()
  lastUsed!: Date
}
