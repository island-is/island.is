import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsJWT } from 'class-validator'

export class XlsxDto {
  @ApiProperty()
  @IsOptional()
  headers?: Array<string>

  @ApiProperty()
  @IsOptional()
  data?: Array<Array<string | number>>

  @IsJWT()
  @ApiProperty()
  readonly __accessToken!: string
}
