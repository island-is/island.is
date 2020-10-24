import { IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class ClaimDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'set_type',
  })
  readonly type: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'set_value',
  })
  readonly value: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'set_value_type',
  })
  readonly valueType: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'set_issuer',
  })
  readonly issuer: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'set_original_issuer',
  })
  readonly originalIssuer: string
}
