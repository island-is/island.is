import { IsString, IsOptional, IsEnum, IsBoolean } from 'class-validator'

import { NameType, StatusType } from '@island.is/icelandic-names-registry-types'

export class UpdateIcelandicNameBodyDto {
  @IsString()
  @IsOptional()
  readonly icelandicName?: string

  @IsOptional()
  @IsEnum(NameType)
  readonly type?: NameType

  @IsOptional()
  @IsEnum(StatusType)
  readonly status?: StatusType

  @IsString()
  @IsOptional()
  readonly description?: string

  @IsBoolean()
  @IsOptional()
  readonly visible?: boolean

  @IsString()
  @IsOptional()
  readonly verdict?: string

  @IsString()
  @IsOptional()
  readonly url?: string
}
