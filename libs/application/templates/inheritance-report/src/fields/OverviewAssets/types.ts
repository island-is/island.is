import { MessageDescriptor } from 'react-intl'

export type SectionType = {
  title: MessageDescriptor | string
  data: RowType[]
  total: string
  totalTitle: MessageDescriptor | string
}

export type RowType = {
  title: MessageDescriptor | string
  value: string
  items: RowItemsType
}

export type RowItemsType = RowItemType[]

export type RowItemType = {
  title: MessageDescriptor | string
  value: string
}

export type RowProps = {
  row: RowType
}
