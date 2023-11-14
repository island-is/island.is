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

export type ChartComponentWithRenderProps = ChartComponent & {
  indexWithinType: number
  shouldRenderBorderRadius: boolean
  renderIndex: number
  hasFill: boolean
  color: string
  fill?: string
}

export type ChartData =
  GetMultipleStatisticsQuery['getStatisticsByKeys']['statistics']
