import { LabelDto as GeneratedLabelDto } from '../..'

export interface LabelDto {
  columnName?: string
  displayTitle?: string
  tooltip?: string
}

export const mapLabelDto = (data: GeneratedLabelDto): LabelDto => {
  return {
    columnName: data.columnName ?? undefined,
    displayTitle: data.displayTitle ?? undefined,
    tooltip: data.tooltip ?? undefined,
  }
}
