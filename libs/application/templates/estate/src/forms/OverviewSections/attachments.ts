import {
  buildDescriptionField,
  buildKeyValueField,
  getValueViaPath,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { Files } from '../../lib/dataSchema'

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
      const files = getValueViaPath<Array<Files>>(
        answers,
        'estateAttachments.attached.file',
      )
      return files?.map((f) => {
        return f.name
      })
    },
    condition: (answers) => {
      const fileLength = getValueViaPath<number>(
        answers,
        'estateAttachments.attached.file.length',
      )
      return fileLength !== undefined && fileLength > 0
    },
  }),
  buildDescriptionField({
    id: 'attachmentsNotFilledOut',
    description: m.notFilledOutItalic,
    space: 'gutter',
    condition: (answers) => {
      const fileLength = getValueViaPath<number>(
        answers,
        'estateAttachments.attached.file.length',
      )
      return fileLength === 0
    },
  }),
]
