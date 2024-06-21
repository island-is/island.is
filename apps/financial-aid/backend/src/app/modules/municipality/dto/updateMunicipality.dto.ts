import {
  IsBoolean,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'
import type { Aid, ChildrenAid } from '@island.is/financial-aid/shared/lib'

export class UpdateMunicipalityDto {
  @IsOptional()
  @IsObject()
  @ApiProperty()
  readonly individualAid?: Aid

  @IsOptional()
  @IsObject()
  @ApiProperty()
  readonly cohabitationAid?: Aid

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly homepage?: string

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly rulesHomepage?: string

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly email?: string

  @IsOptional()
  @IsBoolean()
  @ApiProperty()
  readonly usingNav?: boolean

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly navUrl?: string

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly navUsername?: string

  @IsOptional()
  @IsString()
  @ApiProperty()
  navPassword?: string

  @IsOptional()
  @IsString()
  @ApiProperty()
  childrenAid?: ChildrenAid

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  readonly decemberCompensation?: number

  @IsString()
  @ApiProperty()
  readonly municipalityId: string
}
