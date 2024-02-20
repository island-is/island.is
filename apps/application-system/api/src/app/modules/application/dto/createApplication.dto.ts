import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { ApplicationTypes } from '@island.is/application/types'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateApplicationDto {
  @IsNotEmpty()
  @IsEnum(ApplicationTypes)
  @ApiProperty({ enum: ApplicationTypes })
  readonly typeId!: ApplicationTypes

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly subTypeId?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly initialQuery?: string
}
