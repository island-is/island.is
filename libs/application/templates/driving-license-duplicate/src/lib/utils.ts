import { applicationForMessages } from './messages'
import { MessageDescriptor } from 'react-intl'

type CurrentRightsMessages = {
  title: MessageDescriptor
  rightsDescription: MessageDescriptor
}

export const getApplicationInfo = (rights: string): CurrentRightsMessages => {
  switch (rights) {
    case 'B':
      return applicationForMessages.B_TEMP
    case 'B-full':
      return applicationForMessages.B_FULL
    default:
      return applicationForMessages.B_FULL
  }
}
