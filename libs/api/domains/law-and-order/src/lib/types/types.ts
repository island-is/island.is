import { MessageDescriptor } from 'react-intl'
import { PoliceCaseStatusValue, PoliceCaseStatusValueGroup } from './enums'

export interface Choice {
  message: {
    id: string
    defaultMessage: string
  }
}

export interface PoliceCaseStatusInfo {
  header: MessageDescriptor
  description: MessageDescriptor
  group: PoliceCaseStatusValueGroup
}

export type PoliceCaseStatusInfoMap = {
  [K in Exclude<
    PoliceCaseStatusValue,
    PoliceCaseStatusValue.UNKNOWN
  >]: PoliceCaseStatusInfo
}
