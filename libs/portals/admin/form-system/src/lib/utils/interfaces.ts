import { FormSystemStep, FormSystemGroup, FormSystemInput } from "@island.is/api/schema"


export enum NavbarSelectStatus {
  OFF = 'Off',
  NORMAL = 'Normal',
  LIST_ITEM = 'ListItem',
  ON_WITHOUT_SELECT = 'OnWithoutSelect',
}

export type ItemType = 'Step' | 'Group' | 'Input'

export interface ActiveItem {
  type: ItemType
  data?: FormSystemStep | FormSystemGroup | FormSystemInput | null
}
