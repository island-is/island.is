import { IconProps, TagVariant } from '@island.is/island-ui/core'
export type ConfigType = { direction: 'ascending' | 'descending'; key: string }

export type SortableData = {
  mobileTitle?: string
  subTitleFirstCol?: string
  id: string
  tag?: TagVariant
  lastNode?: {
    type: 'info' | 'action' | 'text' | 'tag'
    label: string
    icon?: Pick<IconProps, 'icon' | 'type'>
    action?: () => void
    text?: string
  }
  children?: React.ReactElement | null // Children for each row if expandable
  onExpandCallback?: () => void
} & { [key: string]: string | React.ReactElement | any }

export type SortableTableProps = {
  items: Array<SortableData>
  labels: {
    [key: string]: string
  }
  footer?:
    | {
        [key: string]: string | number
      }
    | React.ReactElement
  title?: string
  tagOutlined?: boolean // If tags are set, should they be filled or outlined
  expandable?: boolean // Uses "children" key for expandable rows
  defaultSortByKey: string // Starting sort key, use one of keys in SortableData
  sortBy?: 'ascending' | 'descending' // Default sort order
  mobileTitleKey?: string // Key to use for mobile title
  inner?: boolean // Is the table inside another table
  align?: 'left' | 'right'
  ellipsisLength?: number
  emptyTableMessage?: string
  tableLoading?: boolean
}
