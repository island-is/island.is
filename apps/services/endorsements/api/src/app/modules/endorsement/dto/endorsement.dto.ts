import {
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
  IsArray,
  IsObject,
} from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { EndorsementMetadataDto } from '../../endorsementList/dto/endorsementMetadata.dto'

// TODO kíkja betur á fleiri fields og vlaidators

export class EndorsementDto {
  @ApiProperty()
  @IsString()
  id!: string

  @ApiProperty()
  @IsString()
  endorser!: string

  @ApiProperty()
  @IsString()
  endorsementListId!: string

  @ApiProperty()
  @IsOptional()
  @IsObject()
  meta!: EndorsementMetadataDto

}