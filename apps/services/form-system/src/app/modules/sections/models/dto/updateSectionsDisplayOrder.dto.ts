import { ApiProperty } from '@nestjs/swagger'
import { SectionDisplayOrderDto } from './sectionDisplayOrder.dto'
import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

export class UpdateSectionsDisplayOrderDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => SectionDisplayOrderDto)
  @IsArray()
  @ApiProperty({ type: [SectionDisplayOrderDto] })
  sectionsDisplayOrderDto!: SectionDisplayOrderDto[]
}
