import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class AdminScopeDto {
  @IsString()
  @ApiProperty({ example: '@island.is' })
  name!: string

  @IsString()
  @ApiProperty({
    example: 'Ísland.is mínar síður',
  })
  displayName!: string

  @IsString()
  @ApiProperty({
    example: 'set_description',
  })
  description!: string
}
