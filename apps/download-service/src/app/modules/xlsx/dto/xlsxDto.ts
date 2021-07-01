import { ApiProperty } from '@nestjs/swagger'
import { IsJWT, IsString } from 'class-validator'

export class XlsxDto {
  @IsString()
  @ApiProperty()
  readonly serviceId!: string

  @IsJWT()
  @ApiProperty()
  readonly __accessToken!: string
}
