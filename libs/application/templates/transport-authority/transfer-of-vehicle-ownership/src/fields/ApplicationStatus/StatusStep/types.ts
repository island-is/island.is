import { TagVariant } from '@island.is/island-ui/core'
import { MessageDescriptor } from '@formatjs/intl'

export enum AccidentNotificationStatusEnum {
  ACCEPTED = 'ACCEPTED',
  REFUSED = 'REFUSED',
  INPROGRESS = 'INPROGRESS',
  INPROGRESSWAITINGFORDOCUMENT = 'INPROGRESSWAITINGFORDOCUMENT',
}

export interface ReviewSectionProps {
  title: string
  description: string
  hasActionMessage: boolean
  visible?: boolean
  tagText: MessageDescriptor | string
  tagVariant: TagVariant
}

export interface Steps {
  title: string
  description: string
  hasActionMessage: boolean
  visible?: boolean
  tagText: MessageDescriptor | string
  tagVariant: TagVariant
}

export interface SubmittedApplicationData {
  data?: {
    documentId: string
  }
}
