import { IsEnum } from 'class-validator'
import { EndorsementTag } from '../endorsementList.model'

export class FindEndorsementListByTagDto {
  @IsEnum(EndorsementTag)
  tag!: EndorsementTag
}
