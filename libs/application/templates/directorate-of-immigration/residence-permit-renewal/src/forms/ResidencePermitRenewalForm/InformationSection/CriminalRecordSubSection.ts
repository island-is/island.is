import {
  buildMultiField,
  buildSubSection,
  buildDescriptionField,
  getValueViaPath,
  buildCustomField,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'
import * as kennitala from 'kennitala'

export const CriminalRecordSubSection = (index: number) =>
  buildSubSection({
    id: 'criminalRecord',
    title: information.labels.criminalRecord.subSectionTitle,
    condition: (_, externalData) => {
      const nationalId = getValueViaPath(
        externalData,
        'nationalRegistry.data.nationalId',
        '',
      ) as string
      const age = kennitala.info(nationalId).age

      return age >= 15
    },
    children: [
      buildMultiField({
        id: 'criminalRecordMultiField',
        title: information.labels.criminalRecord.pageTitle,
        children: [
          buildCustomField({
            id: 'criminalRecord',
            title: '',
            component: 'CriminalRecord',
          }),
        ],
      }),
    ],
  })
