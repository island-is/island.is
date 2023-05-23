import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger'
import { DraftRegulationShippedModel } from './draftRegulationShipped.model'

export class PagingModel {
  @ApiPropertyOptional()
  readonly page?: number

  @ApiPropertyOptional()
  readonly pages?: number
}

export class DraftSummaryModel extends PartialType(
  DraftRegulationShippedModel,
) {}

export class TaskListModel {
  @ApiProperty()
  readonly drafts!: Array<DraftSummaryModel>

  @ApiPropertyOptional()
  readonly paging?: PagingModel
}
