import '@tanstack/react-table'
import type { RowData } from '@tanstack/react-table'

declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    align?: 'left' | 'right'
    /** Skip the `<Text>` wrapper — use for interactive cells (input, button) */
    noTextWrapper?: boolean
    /** Mobile only: render cell full-width with no label, outside the key-value grid */
    mobileFullWidth?: boolean
  }
}
