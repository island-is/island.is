import { IsString, IsOptional } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class ClaimDto {
  @IsString()
  @ApiProperty({
    example: 'set_type',
  })
  readonly type: string

  @IsString()
  @ApiProperty({
    example: 'set_value',
  })
  readonly value: string

  @IsString()
  @ApiProperty({
    example: 'set_value_type',
  })
  readonly valueType: string

  @IsString()
  @ApiProperty({
    example: 'set_issuer',
  })
  readonly issuer: string

  @IsString()
  @ApiProperty({
    example: 'set_original_issuer',
  })
  readonly originalIssuer: string
}
