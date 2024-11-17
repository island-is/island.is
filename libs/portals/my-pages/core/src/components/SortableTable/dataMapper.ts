import { IconProps, TagVariant } from '@island.is/island-ui/core'

export type SortableData = {
  name: string
  id: string
  tag?: TagVariant
  lastNode?: {
    type: 'info' | 'action' | 'text' | 'tag'
    label: string
    icon?: Pick<IconProps, 'icon' | 'type'>
    action?: () => void
  }
  children?: React.ReactElement // Children for each row if expandable
} & { [key: string]: string | React.ReactElement | any }

export type SortableTableProps = {
  items: Array<SortableData>
  labels: {
    [key: string]: string
  }
  footer?: {
    [key: string]: string | number
  }
  title?: string
  tagOutlined?: boolean // If tags are set, should they be filled or outlined
  expandable?: boolean // Uses "children" key for expandable rows
  defaultSortByKey?: string // Starting sort key, use one of keys in SortableData
}
