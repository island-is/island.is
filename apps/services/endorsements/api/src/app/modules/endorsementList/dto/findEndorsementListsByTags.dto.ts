import { Transform } from 'class-transformer'
import { IsEnum, IsArray } from 'class-validator'
import { EndorsementTag } from '../endorsementList.model'

export class FindEndorsementListByTagsDto {
  @Transform((tags) => (!Array.isArray(tags) ? [tags] : tags)) // serialize query array parameters to array
  @IsEnum(EndorsementTag, { each: true })
  tags!: EndorsementTag[]
}
