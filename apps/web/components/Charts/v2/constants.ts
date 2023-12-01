import { theme } from '@island.is/island-ui/theme'

import { ChartComponentType, FillPattern } from './types'

/**
 * A list with pixels that define how the line should be displayed
 * 4 4 => 4 pixels filled 4 pixels empty
 * 4 2 => 4 pixels filled 2 pixels empty
 * 4 1 1 1 => 4 pixels filled 1 pixel empty 1 pixel filled 1 pixel empty
 * ... and so on
 */
export const PREDEFINED_LINE_DASH_PATTERNS = ['16 2', '16 2 4 2', '8 2', '3 2']

/**
 * Pattern implementations are found in generateFillPattern() from utils.tsx
 */
export const PREDEFINED_FILL_PATTERNS: FillPattern[] = [
  FillPattern.diagonalSeToNw,
  FillPattern.diagonalSwToNe,
  FillPattern.diagonalSeToNwDense,
  FillPattern.diagonalSwToNeDense,
  FillPattern.dotsSmall,
  FillPattern.dotsMedium,
  FillPattern.dotsLarge,
  FillPattern.horizontal,
  FillPattern.vertical,
]
export const PREDEFINED_PIE_FILL_PATTERNS: FillPattern[] = [
  FillPattern.dotsSmall,
  FillPattern.diagonalSeToNw,
  FillPattern.dotsMedium,
  FillPattern.diagonalSwToNe,
  FillPattern.dotsLarge,
  FillPattern.diagonalSeToNwDense,
  FillPattern.diagonalSwToNeDense,
]

/**
 * By default this will be the order of colors given to chart components
 * Unless they specifically opt to overwrite them
 */
export const DEFAULT_COLORS = [
  theme.color.blue400,
  theme.color.purple300,
  theme.color.blueberry400,
  theme.color.roseTinted300,
  theme.color.purple400,
  theme.color.blueberry300,
  theme.color.roseTinted400,
  theme.color.blue300,
  theme.color.dark400,
  theme.color.dark300,
]

export const COMPONENT_TYPES_WITH_FILL = [
  ChartComponentType.area,
  ChartComponentType.bar,
  ChartComponentType.pie,
]

export const DEFAULT_XAXIS_KEY = 'date'

export const BASE_ACCORDION_HEIGHT = 150
export const CHART_HEIGHT = 500
