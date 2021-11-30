import { TagVariant } from '@island.is/island-ui/core'
import { MessageDescriptor } from '@formatjs/intl'

export interface ActionProps {
  title: string
  description: string
  fileNames?: string
  actionButtonTitle: string
  hasActionButtonIcon?: boolean
  showAlways?: boolean
  cta?: () => void
}

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
  action?: ActionProps
  visible?: boolean
  tagText: MessageDescriptor | string
  tagVariant: TagVariant
}

export interface Steps {
  title: string
  description: string
  hasActionMessage: boolean
  action?: ActionProps
  visible?: boolean
  tagText: MessageDescriptor | string
  tagVariant: TagVariant
}

export interface SubmittedApplicationData {
  data?: {
    documentId: string
  }
}

export interface ApplicationStatusProps {
  field: {
    props: {
      isAssignee: boolean
    }
  }
}
