import { theme } from '@island.is/island-ui/theme'

import { ChartComponentType, FillPattern } from './types'

/**
 * A list with pixels that define how the line should be displayed
 * 4 4 => 4 pixels filled 4 pixels empty
 * 4 2 => 4 pixels filled 2 pixels empty
 * 4 1 1 1 => 4 pixels filled 1 pixel empty 1 pixel filled 1 pixel empty
 * ... and so on
 */

// TODO: see in action
export const PREDEFINED_LINE_DASH_PATTERNS = [
  '16 3',
  '4 8 4 4 8 4',
  '6 12 18 24',
  '4 1',
  '6 6',
  '4 6 24 4 6 24',
]

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

export const PRIMARY_FILL_PATTERNS: FillPattern[] = [
  FillPattern.diagonalSeToNw,
  FillPattern.vertical,
  FillPattern.waves,
  FillPattern.denseDots,
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
 * This will be the colors chosen for charts with the same type
 * of components, for example: just lines / bars.
 *
 * By default the colors will appear in the same order as here
 */
export const PRIMARY_COLORS = [
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

/**
 * This will be the colors chosen for the secondary types
 * of components in a multi type chart, for example:
 * bars and a line, the line will receive the secondary color
 *
 * By default the colors will appear in the same order as here
 */
export const SECONDARY_COLORS = [
  theme.color.roseTinted400,
  theme.color.blue300,
  theme.color.purple400,
  theme.color.blueberry300,
  theme.color.blueberry400,
  theme.color.roseTinted300,
  theme.color.blue400,
  theme.color.purple300,
]

export const COMPONENT_TYPES_WITH_FILL = [
  ChartComponentType.area,
  ChartComponentType.bar,
  ChartComponentType.pie,
]

export const DEFAULT_XAXIS_KEY = 'date'
export const DEFAULT_XAXIS_FORMAT = 'MMM yy'

export const BASE_ACCORDION_HEIGHT = 150
export const CHART_HEIGHT = 500
