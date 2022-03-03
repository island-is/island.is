import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

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
