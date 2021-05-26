import { IsEnum } from 'class-validator'
import { EndorsementTag } from '../endorsementList.model'

export class FindEndorsementListByTagsDto {
  @IsEnum(EndorsementTag, { each: true })
  tags!: EndorsementTag[]
}
