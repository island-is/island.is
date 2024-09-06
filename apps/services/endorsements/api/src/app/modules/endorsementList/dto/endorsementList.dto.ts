import {
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
  IsArray,
  IsObject,
  IsBoolean,
  IsDate,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, PartialType, OmitType } from '@nestjs/swagger';
import { EndorsementTag } from '../constants';
import { EndorsementMetadataDto } from './endorsementMetadata.dto';

// Main DTO with all fields (for returning data)
export class EndorsementListDto {
  @ApiProperty()
  @IsString()
  id!: string;

  @ApiProperty()
  @IsString()
  title!: string;

  @ApiProperty()
  @IsString()
  description!: string;

  @ApiProperty({ type: [EndorsementMetadataDto], nullable: true })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => EndorsementMetadataDto)
  @IsArray()
  endorsementMetadata = [] as EndorsementMetadataDto[];

  @ApiProperty({ enum: EndorsementTag, isArray: true, nullable: true })
  @IsOptional()
  @IsArray()
  @IsEnum(EndorsementTag, { each: true })
  tags = [] as EndorsementTag[];

  @ApiProperty({ nullable: true })
  @IsOptional()
  @IsObject()
  meta = {};
  
  @ApiProperty({ type: Date })
  @Type(() => Date)
  @IsDate()
  openedDate!: Date;

  @ApiProperty({ type: Date })
  @Type(() => Date)
  @IsDate()
  closedDate!: Date;
  
  @ApiProperty({ type: Boolean })
  @IsBoolean()
  adminLock!: boolean;

  @ApiProperty({ type: Number })
  @IsNumber()
  endorsementCount!: number;

  @ApiProperty({ type: String })
  owner!: string;

  @ApiProperty({ type: Date })
  @Type(() => Date)
  @IsDate()
  created!: Date;

  @ApiProperty({ type: Date })
  @Type(() => Date)
  @IsDate()
  updated!: Date;
}

// Create DTO that omits id, created, updated, owner, adminLock, and endorsementCount
export class CreateEndorsementListDto extends OmitType(EndorsementListDto, [
  'id',
  'created',
  'updated',
  'owner',
  'adminLock',
  'endorsementCount',
] as const) {}

// Update DTO that is a partial type of the Create DTO
export class UpdateEndorsementListDto extends PartialType(CreateEndorsementListDto) {}
// adminlock.....