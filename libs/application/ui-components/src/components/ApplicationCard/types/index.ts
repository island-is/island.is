import { Application, InstitutionTypes } from '@island.is/application/types'
import { TagVariant } from '@island.is/island-ui/core'
import { MessageDescriptor } from 'react-intl'

export type ApplicationCardFields = Pick<
  Application,
  'actionCard' | 'id' | 'typeId' | 'status' | 'modified' | 'name' | 'progress'
> & {
  // form system applications have additional fields
  formSystemFormSlug?: string
  formSystemOrgSlug?: InstitutionTypes
  formSystemOrgContentfulId?: string
}

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
