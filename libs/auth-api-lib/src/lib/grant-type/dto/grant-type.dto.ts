import { IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class GrantTypeDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'grant_name',
  })
  readonly name!: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'grant type description',
  })
  readonly description!: string
}
