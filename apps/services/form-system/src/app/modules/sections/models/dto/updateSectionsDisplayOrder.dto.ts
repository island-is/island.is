import { ApiProperty } from '@nestjs/swagger'
import { SectionDisplayOrderDto } from './sectionDisplayOrder.dto'

export class UpdateSectionsDisplayOrderDto {
  @ApiProperty({ type: [SectionDisplayOrderDto] })
  sectionsDisplayOrderDto!: SectionDisplayOrderDto[]
}
