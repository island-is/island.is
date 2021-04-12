import { IsString, IsOptional, IsEnum, IsBoolean } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

import { NameType, StatusType } from '@island.is/icelandic-names-registry-types'

export class UpdateIcelandicNameBodyDto {
  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly icelandicName?: string

  @IsOptional()
  @ApiProperty()
  @IsEnum(NameType)
  readonly type?: NameType

  @IsOptional()
  @ApiProperty()
  @IsEnum(StatusType)
  readonly status?: StatusType

  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly description?: string

  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  readonly visible?: boolean

  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly verdict?: string

  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly url?: string
}
