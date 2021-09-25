import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsOptional } from 'class-validator'
import { EndorsementMetaField } from '../../endorsementMetadata/types'

export class EndorsementMetadataDto {
  @ApiProperty({ enum: EndorsementMetaField })
  @IsEnum(EndorsementMetaField)
  field!: EndorsementMetaField

  @ApiProperty({ type: Boolean, required: false })
  @IsOptional()
  keepUpToDate?: boolean = false
}
