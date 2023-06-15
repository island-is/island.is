import {
  buildCheckboxField,
  buildCustomField,
  buildDescriptionField,
  buildDividerField,
  buildKeyValueField,
  buildMultiField,
  buildSection,
  buildSubmitField,
  getValueViaPath,
} from '@island.is/application/core'
import { Application, DefaultEvents } from '@island.is/application/types'
import { EstateInfo } from '@island.is/clients/syslumenn'
import { m } from '../../lib/messages'
import { format as formatNationalId } from 'kennitala'
import {
  formatBankInfo,
  formatCurrency,
} from '@island.is/application/ui-components'
import { infer as zinfer } from 'zod'
import { estateSchema } from '../../lib/dataSchema'
import { EstateTypes, NEI, NO, YES } from '../../lib/constants'
import { commonOverviewFields } from './commonFields'
import { overviewAssetsAndDebts } from './overviewAssetsAndDebts'
type EstateSchema = zinfer<typeof estateSchema>

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
    id: 'space4',
    title: '',
    space: 'gutter',
  }),
]
