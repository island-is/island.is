import {
  buildDescriptionField,
  buildMultiField,
  buildSection,
  getValueViaPath,
} from '@island.is/application/core'
import { externalData } from '../../../lib/messages/externalData'
import { FormValue } from '@island.is/application/types'

export const announcementSection = buildSection({
  id: 'externalData',
  title: externalData.dataProvider.announcement,
  condition: (formValue: FormValue, externalData, user) => {
    const type = getValueViaPath<string>(externalData, 'identity.data.type')
    return type === 'person'
  },
  children: [
    buildMultiField({
      title: externalData.dataProvider.announcement,
      children: [
        buildDescriptionField({
          id: 'externalData.firstHeading',
          title: '',
          titleVariant: 'h4',
        }),
        buildDescriptionField({
          id: 'externalData.Description',
          title: '',
          description: externalData.dataProvider.announcementDescription,
          titleVariant: 'h4',
          marginBottom: 3,
        }),
      ],
    }),
  ],
})
