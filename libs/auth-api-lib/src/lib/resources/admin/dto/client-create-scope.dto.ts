import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class ClientCreateScopeDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '@island.is' })
  name!: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Ísland.is mínar síður',
  })
  displayName!: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Description about the scope',
  })
  description!: string
}
