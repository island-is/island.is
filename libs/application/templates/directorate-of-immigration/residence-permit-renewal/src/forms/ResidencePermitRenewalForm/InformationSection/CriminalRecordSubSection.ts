import {
  buildMultiField,
  buildSubSection,
  buildDescriptionField,
  getValueViaPath,
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
        description: information.labels.criminalRecord.description,
        children: [
          buildDescriptionField({
            id: 'criminalRecord.title',
            title: information.labels.criminalRecord.title,
            titleVariant: 'h5',
          }),
        ],
      }),
    ],
  })
