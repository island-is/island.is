import {
  buildDescriptionField,
  buildMultiField,
  buildSection,
  getValueViaPath,
} from '@island.is/application/core'
import { externalData } from '../../../lib/messages/externalData'
import { Application, FormValue } from '@island.is/application/types'

export const announcementSection = buildSection({
  id: 'externalData',
  title: externalData.dataProvider.announcement,
  condition: (formValue: FormValue, externalData, user) => {
    const type = getValueViaPath(externalData, 'identity.data.type') as string
    return type === 'person'
  },
  children: [
    buildMultiField({
      title: externalData.dataProvider.announcement,
      children: [
        buildDescriptionField({
          id: 'externalData.firstHeading',
          title: externalData.dataProvider.announcementHeading,
          titleVariant: 'h4',
          marginBottom: 3,
        }),
        buildDescriptionField({
          id: 'externalData.Description',
          title: '',
          description: externalData.dataProvider.announcementDescription,
          titleVariant: 'h4',
          marginBottom: 3,
        }),
        buildDescriptionField({
          id: 'externalData.secondHeading',
          title: (application: Application) => {
            const ssn = getValueViaPath(
              application.externalData,
              'identity.data.nationalId',
            )
            const name = getValueViaPath(
              application.externalData,
              'identity.data.name',
            )
            return {
              ...externalData.dataProvider.announcementHeadingSecond,
              values: {
                notandi: `${name} (${ssn})`,
              },
            }
          },
          titleVariant: 'h4',
          marginBottom: 3,
        }),
        // TODO ADD company national id input here!
      ],
    }),
  ],
})
