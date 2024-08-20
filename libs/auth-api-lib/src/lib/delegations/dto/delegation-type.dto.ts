import { IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class DelegationTypeDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'PersonalRepresentative:health',
  })
  readonly id!: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'talsmannagrunnur',
  })
  readonly providerId!: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Personal Representative: Health',
  })
  readonly name!: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Personal representative delegation type for right type health',
  })
  readonly description!: string
}
