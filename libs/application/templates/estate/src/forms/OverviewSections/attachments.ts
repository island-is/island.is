import {
  buildCustomField,
  buildDescriptionField,
  buildKeyValueField,
  getValueViaPath,
} from '@island.is/application/core'
import { m } from '../../lib/messages'

export const overviewAttachments = [
  buildDescriptionField({
    id: 'overviewAttachments',
    title: m.attachmentsTitle,
    titleVariant: 'h3',
    space: 'gutter',
    marginBottom: 'gutter',
  }),
  buildKeyValueField({
    label: '',
    value: ({ answers }) => {
      const attachments = getValueViaPath(answers, 'estateAttachments') as any
      return attachments?.attached.file.map(
        (f: { key: string; name: string }) => {
          return f.name
        },
      )
    },
    condition: (answers) => {
      const files = getValueViaPath(answers, 'estateAttachments') as {
        attached: { file: { length: number } }
      }
      return files?.attached?.file?.length > 0
    },
  }),
  buildCustomField({
    id: 'attachmentsNotFilledOut',
    title: '',
    component: 'NotFilledOut',
    condition: (answers) => {
      const files = getValueViaPath(answers, 'estateAttachments') as {
        attached: { file: { length: number } }
      }
      return files?.attached?.file?.length === 0
    },
  }),
  buildDescriptionField({
    id: 'spaceAttachments',
    title: '',
    space: 'gutter',
  }),
]
