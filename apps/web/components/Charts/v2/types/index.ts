import {
  ChartComponent,
  GetMultipleStatisticsQuery,
} from '@island.is/web/graphql/schema'

export enum FillPattern {
  diagonalSwToNe = 'pattern1',
  diagonalSeToNw = 'pattern2',
  diagonalSwToNeDense = 'pattern3',
  diagonalSeToNwDense = 'pattern4',
  horizontal = 'pattern5',
  vertical = 'pattern6',
  dotsSmall = 'pattern7',
  dotsMedium = 'pattern8',
  dotsLarge = 'pattern9',
  waves = 'pattern10',
  denseDots = 'pattern11',
}

export enum ChartComponentType {
  line = 'line',
  bar = 'bar',
  area = 'area',
  pie = 'pie-cell',
}

export enum ChartType {
  area = 'area',
  line = 'line',
  bar = 'bar',
  pie = 'pie',
  mixed = 'mixed',
}

export type ChartComponentWithRenderProps = ChartComponent & ComponentStyle

export type DataItemDynamicKeys = {
  [key: string]: string | number | null
}

type SingleStatistic =
  GetMultipleStatisticsQuery['getStatisticsByKeys']['statistics'][number]

export type DataItem = SingleStatistic & DataItemDynamicKeys

export type ChartData = DataItem[]

export interface ComponentStyle {
  color: string
  hasFill: boolean
  pattern?: string
  patternId?: string
  shouldRenderBorderRadius: boolean
  renderIndex: number
  renderIndexForType: number
}
