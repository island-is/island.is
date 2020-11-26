import { IsString, IsBoolean, IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class ApiScopesDTO {
  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: true,
  })
  readonly enabled: boolean

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'set_name',
  })
  readonly name: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'set_display_name',
  })
  readonly displayName: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'set_description',
  })
  readonly description: string

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: true,
  })
  readonly showInDiscoveryDocument: boolean

  // Common properties end

  @IsBoolean()
  @ApiProperty({
    example: false,
  })
  readonly required: boolean

  @IsBoolean()
  @ApiProperty({
    example: false,
  })
  readonly emphasize: boolean
}
