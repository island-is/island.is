import { ApplicationCard as ApplicationCardType } from '@island.is/application/types'
import { TagVariant } from '@island.is/island-ui/core'
import { MessageDescriptor } from 'react-intl'

export type ApplicationCardFields = Pick<
  ApplicationCardType,
  | 'actionCard'
  | 'id'
  | 'typeId'
  | 'status'
  | 'modified'
  | 'name'
  | 'progress'
  | 'org'
  | 'orgContentfulId'
  | 'slug'
  | 'applicationPath'
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
  subjectAndActor?: string
  content?: React.ReactNode
}
