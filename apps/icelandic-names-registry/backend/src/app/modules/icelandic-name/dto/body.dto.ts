import { IsString, IsOptional, IsEnum, IsBoolean } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

enum EnumNameType {
  ST = 'ST',
  DR = 'DR',
  MI = 'MI',
  RST = 'RST',
  RDR = 'RDR',
}

enum EnumStatusType {
  ST = 'Haf',
  DR = 'Sam',
  OAF = 'Óaf',
}

type NameType = 'ST' | 'DR' | 'MI' | 'RST' | 'RDR'
type StatusType = 'Haf' | 'Sam' | 'Óaf'

export class UpdateIcelandicNameBody {
  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly icelandic_name?: string

  @IsOptional()
  @ApiProperty()
  @IsEnum(EnumNameType)
  readonly type?: NameType

  @IsOptional()
  @ApiProperty()
  @IsEnum(EnumStatusType)
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
  @Type(() => String)
  @ApiProperty()
  readonly verdict?: string

  @IsString()
  @IsOptional()
  @Type(() => String)
  @ApiProperty()
  readonly url?: string
}

export class CreateIcelandicNameBody {
  @IsString()
  @ApiProperty()
  readonly icelandic_name!: string

  @ApiProperty()
  @IsString()
  @IsEnum(EnumNameType)
  readonly type?: NameType

  @IsOptional()
  @ApiProperty()
  @IsString()
  @IsEnum(EnumStatusType)
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
  @Type(() => String)
  @ApiProperty()
  readonly verdict?: string

  @IsString()
  @IsOptional()
  @Type(() => String)
  @ApiProperty()
  readonly url?: string
}
