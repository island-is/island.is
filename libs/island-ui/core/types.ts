/**
 * Some libraries are depending on the types of the Island UI.
 * However they are not allowing JSX inside their code. This file
 * is used to expose only the types and not import JSX code inside
 * libraries that are not allowing it.
 *
 * Usage: `import { BoxProps } from @island.is/island-ui/core/types`
 */

export type { BoxProps } from './src/lib/Box/types'
export type { InputBackgroundColor, InputProps } from './src/lib/Input/types'
export type {
  DatePickerBackgroundColor,
  DatePickerProps,
} from './src/lib/DatePicker/types'
export type { ResponsiveProp } from './src/utils/responsiveProp'
export type { GridColumns } from './src/lib/Grid/GridColumn/GridColumn.css'
