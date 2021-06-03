import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsEnum } from 'class-validator'
import { EndorsementTag } from '../endorsementList.model'

export class FindEndorsementListByTagsDto {
  @ApiProperty({ enum: EndorsementTag, isArray: true })
  // query parameters of length one are not arrays, we normalize all tags input to arrays here
  @Transform((tags) => (!Array.isArray(tags) ? [tags] : tags))
  @IsEnum(EndorsementTag, { each: true })
  tags!: EndorsementTag[]
}
