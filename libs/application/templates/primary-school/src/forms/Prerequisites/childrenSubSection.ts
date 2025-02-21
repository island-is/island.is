import {
  buildMultiField,
  buildRadioField,
  buildSubSection,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import { format as formatKennitala } from 'kennitala'
import { primarySchoolMessages } from '../../lib/messages'
import { getApplicationExternalData } from '../../lib/primarySchoolUtils'

export const childrenSubSection = buildSubSection({
  id: 'childrenSubSection',
  title: primarySchoolMessages.pre.childrenSubSectionTitle,
  children: [
    buildMultiField({
      id: 'childrenMultiField',
      title: primarySchoolMessages.pre.childrenSubSectionTitle,
      description: primarySchoolMessages.pre.childrenDescription,
      children: [
        buildRadioField({
          id: 'childNationalId',
          title: primarySchoolMessages.pre.childrenRadioTitle,
          options: (application) => {
            const { children } = getApplicationExternalData(
              application.externalData,
            )

            return children.map((child) => {
              return {
                value: child.nationalId,
                label: child.fullName,
                subLabel: formatKennitala(child.nationalId),
              }
            })
          },
          required: true,
        }),
        buildSubmitField({
          id: 'submit',
          placement: 'footer',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: primarySchoolMessages.pre.startApplication,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
