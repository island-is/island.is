import { FieldBaseProps } from '@island.is/application/types'
import { FC } from 'react'

type Group = {
  Code: number
  LabelIs: string
  LabelEn: string
  ValidToSelect: number
}

type Item = {
  Code: number
  Parent_Group: number
  LabelIs: string
  LabelEn: string
  ValidToSelect: number
}

type MultiSelectControllerProps = {
  groups: Group[]
  items: Item[]
}

export const MultiSelectController: FC<
  React.PropsWithChildren<MultiSelectControllerProps & FieldBaseProps>
> = (props) => {
  return <></>
}
