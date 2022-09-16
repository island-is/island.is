import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class DomainDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '@island.is',
  })
  readonly name!: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Domain for Island.is',
  })
  readonly description!: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '0123456789',
  })
  readonly nationalId!: string
}
