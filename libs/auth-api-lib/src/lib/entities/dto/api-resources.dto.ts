import { IsString, IsBoolean, IsNotEmpty, IsDate } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class ApiResourcesDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '1234567890',
  })
  readonly nationalId!: string

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: true,
  })
  readonly enabled!: boolean

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'set_name',
  })
  readonly name!: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'set_display_name',
  })
  readonly displayName!: string

  @IsString()
  @ApiProperty({
    example: 'set_description',
  })
  readonly description!: string

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: true,
  })
  readonly showInDiscoveryDocument!: boolean

  @IsDate()
  @ApiProperty({
    example: null,
  })
  archived!: Date
}
