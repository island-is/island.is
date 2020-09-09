import { IsString, Length } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class ClaimDto {
  @IsString()
  @ApiProperty()
  readonly type: string

  @IsString()
  @ApiProperty()
  readonly value: string

  @IsString()
  @ApiProperty()
  readonly valueType: string

  @IsString()
  @ApiProperty()
  readonly issuer: string

  @IsString()
  @ApiProperty()
  readonly originalIssuer: string
}
