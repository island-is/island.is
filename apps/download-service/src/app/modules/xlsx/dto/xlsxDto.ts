import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsJWT, IsString } from 'class-validator'

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

  @IsString()
  serviceId?: string
}
