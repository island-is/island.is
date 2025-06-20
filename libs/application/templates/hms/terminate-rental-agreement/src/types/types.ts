import { DefaultEvents } from '@island.is/application/types'

export type Events = {
  type: DefaultEvents.SUBMIT
}

export type FileType = {
  url?: string | undefined
  name: string
  key: string
}
