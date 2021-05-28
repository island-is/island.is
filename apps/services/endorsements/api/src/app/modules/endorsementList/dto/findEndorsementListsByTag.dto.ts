import { ApiProperty } from '@nestjs/swagger'
import { IsEnum } from 'class-validator'
import { EndorsementTag } from '../endorsementList.model'

export class FindEndorsementListByTagDto {
  @ApiProperty({ enum: EndorsementTag })
  @IsEnum(EndorsementTag)
  tag!: EndorsementTag
}
