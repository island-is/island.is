import { IsString, IsNumber, IsOptional, IsEnum } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

enum NameType {
  ST = 'ST',
  DR = 'DR',
  MI = 'MI',
  RST = 'RST',
  RDR = 'RDR',
}

enum StatusType {
  ST = 'Haf',
  DR = 'Sam',
  OAF = 'Óaf',
}

export class UpdateIcelandicNameBody {
  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly icelandic_name?: string

  @IsString()
  @IsOptional()
  @ApiProperty()
  @IsEnum(NameType)
  readonly type?: NameType

  @IsString()
  @IsOptional()
  @ApiProperty()
  @IsEnum(StatusType)
  readonly status?: StatusType

  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly description?: string

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  readonly visible?: number

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

  @IsString()
  @ApiProperty()
  @IsEnum(NameType)
  readonly type?: NameType

  @IsString()
  @IsOptional()
  @ApiProperty()
  @IsEnum(StatusType)
  readonly status?: StatusType

  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly description?: string

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  readonly visible?: number

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
