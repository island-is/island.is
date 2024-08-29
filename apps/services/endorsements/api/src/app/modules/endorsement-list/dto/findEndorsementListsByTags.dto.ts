import { ApiProperty } from '@nestjs/swagger'
import { IsEnum } from 'class-validator'
import { EndorsementTag } from '../constants'

export class FindEndorsementListByTagsDto {
  @ApiProperty({ enum: EndorsementTag, isArray: true })
  @IsEnum(EndorsementTag, { each: true })
  tags!: EndorsementTag[]
}
