import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class ClientClaimDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'clientId',
  })
  readonly clientId!: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'claim type',
  })
  readonly type!: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'claim value',
  })
  readonly value!: string
}
