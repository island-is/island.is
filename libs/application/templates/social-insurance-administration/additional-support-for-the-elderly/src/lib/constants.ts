import { additionalSupportForTheElderyFormMessage } from './messages'
import { MessageDescriptor } from 'react-intl'

export const YES = 'yes'
export const NO = 'no'

export const MONTHS = [
  {
    value: 'January',
    label: additionalSupportForTheElderyFormMessage.months.january,
  },
  {
    value: 'February',
    label: additionalSupportForTheElderyFormMessage.months.february,
  },
  {
    value: 'March',
    label: additionalSupportForTheElderyFormMessage.months.march,
  },
  {
    value: 'April',
    label: additionalSupportForTheElderyFormMessage.months.april,
  },
  { value: 'May', label: additionalSupportForTheElderyFormMessage.months.may },
  {
    value: 'June',
    label: additionalSupportForTheElderyFormMessage.months.june,
  },
  {
    value: 'July',
    label: additionalSupportForTheElderyFormMessage.months.july,
  },
  {
    value: 'August',
    label: additionalSupportForTheElderyFormMessage.months.august,
  },
  {
    value: 'September',
    label: additionalSupportForTheElderyFormMessage.months.september,
  },
  {
    value: 'October',
    label: additionalSupportForTheElderyFormMessage.months.october,
  },
  {
    value: 'November',
    label: additionalSupportForTheElderyFormMessage.months.november,
  },
  {
    value: 'December',
    label: additionalSupportForTheElderyFormMessage.months.desember,
  },
]

export const AttachmentLabel: {
  [key: string]: MessageDescriptor
} = {
  additionalDocuments:
    additionalSupportForTheElderyFormMessage.confirm
      .additionalDocumentsAttachment,
}
