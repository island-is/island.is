import { IsString, IsBoolean } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class ApiScopesDTO {
  @IsBoolean()
  @ApiProperty({
    example: true,
  })
  enabled: boolean

  @IsString()
  @ApiProperty({
    example: "set_name"
  })
  name: string

  @IsString()
  @ApiProperty({
    example: "set_display_name"
  })
  displayName: string

  @IsString()
  @ApiProperty({
    example: "set_description"
  })
  description: string

  @IsBoolean()
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
