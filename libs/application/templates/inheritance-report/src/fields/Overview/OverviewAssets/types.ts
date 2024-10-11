import { MessageDescriptor } from 'react-intl'

export type SectionType = {
  title: MessageDescriptor | string
  data: RowType[]
  total?: string
  totalTitle?: MessageDescriptor | string
  showTotalFirst?: boolean
}

export type RowType = {
  title?: MessageDescriptor | string
  value?: string
  items?: RowItemsType
}

export type RowItemsType = RowItemType[]

export type RowItemType = {
  title: MessageDescriptor | string
  titleVariant?: 'h2' | 'h3' | 'h4'
  valueVariant?:
    | 'default'
    | 'small'
    | 'medium'
    | 'intro'
    | 'eyebrow'
    | 'h2'
    | 'h3'
    | 'h4'
  value: string
  type?: 'default' | 'info'
}

export type RowProps = {
  row: RowType
}
