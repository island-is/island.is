import { Application } from '@island.is/application/types'
import { TagVariant } from '@island.is/island-ui/core'
import { MessageDescriptor } from 'react-intl'
import { MyPagesApplication } from '@island.is/portals/my-pages/applications'

export type ApplicationCardFields = Pick<
  MyPagesApplication,
  | 'actionCard'
  | 'id'
  | 'typeId'
  | 'status'
  | 'modified'
  | 'name'
  | 'progress'
  | 'slug'
  | 'localhostPath'
  | 'path'
>

export interface DefaultCardData {
  tag: {
    variant: TagVariant
    label: MessageDescriptor
  }
  progress: {
    variant: 'blue' | 'red' | 'rose' | 'mint'
  }
  cta: {
    label: MessageDescriptor
  }
}

export type ApplicationCardHistoryItem = {
  date?: string
  title: string
  content?: React.ReactNode
}
