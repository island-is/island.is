import { IsString, IsBoolean, IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class ApiScopesDTO {
  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: true,
  })
  enabled: boolean

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'set_name',
  })
  name: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'set_display_name',
  })
  displayName: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'set_description',
  })
  description: string

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: true,
  })
  showInDiscoveryDocument: boolean

  // Common properties end

  @IsBoolean()
  @ApiProperty({
    example: false,
  })
  required: boolean

  @IsBoolean()
  @ApiProperty({
    example: false,
  })
  emphasize: boolean
}
