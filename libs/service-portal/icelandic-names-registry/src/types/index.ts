import { IcelandicName } from '../queries/schema'

export interface IcelandicNameInputs {
  id?: number
  icelandicName: string
  type: string
  status: string
  description?: null | string
  verdict?: null | string
  url?: null | string
  visible: boolean
}

export type TIcelandicName = Pick<
  IcelandicName,
  'id' | 'icelandicName' | 'type' | 'status' | 'visible' | 'description' | 'url'
>
