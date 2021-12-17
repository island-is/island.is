import { ApiProperty } from '@nestjs/swagger'
import { IsEnum } from 'class-validator'

// add types for new metadata fields here
export enum EndorsementMetaField {
  FULL_NAME = 'fullName',
  SHOW_NAME = 'showName',
}

export class EndorsementMetadataDto {
  @ApiProperty({ enum: EndorsementMetaField })
  @IsEnum(EndorsementMetaField)
  field!: EndorsementMetaField
}
