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
export type { SpanType } from './src/lib/Grid/GridColumn/GridColumn.css'
export type { ActionCardProps } from './src/lib/ActionCard/types'
export type { TagProps, TagVariant } from './src/lib/Tag/types'
export type {
  ButtonProps,
  ButtonSizes,
  ButtonTypes,
} from './src/lib/Button/types'
export * from './src/lib/IconRC/types'
export const fileExtensionWhitelist = {
  '.pdf': 'application/pdf',
  '.doc': 'application/msword',
  '.docx':
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.rtf': 'application/rtf',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.heic': 'image/heic',
  '.csv': 'text/csv',
  '.xlx': 'application/vnd.ms-excel',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.txt': 'text/plain',
  '.odt': 'application/vnd.oasis.opendocument.text',
  '.fodt': 'application/vnd.oasis.opendocument.text',
  '.ods': 'application/vnd.oasis.opendocument.spreadsheet',
  '.fods': 'application/vnd.oasis.opendocument.spreadsheet',
  '.odp': 'application/vnd.oasis.opendocument.presentation',
  '.fodp': 'application/vnd.oasis.opendocument.presentation',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
}
