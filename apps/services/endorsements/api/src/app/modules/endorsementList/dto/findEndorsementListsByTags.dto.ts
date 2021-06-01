import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsEnum } from 'class-validator'
import { EndorsementTag } from '../endorsementList.model'

export class FindEndorsementListByTagsDto {
  @ApiProperty({ enum: EndorsementTag, isArray: true })
  @Transform((tags) => (!Array.isArray(tags) ? [tags] : tags)) // serialize query array parameters to array
  @IsEnum(EndorsementTag, { each: true })
  tags!: EndorsementTag[]
}
