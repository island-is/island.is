import {
  buildMultiField,
  buildRadioField,
  buildSubSection,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import { format as formatKennitala } from 'kennitala'
import { newPrimarySchoolMessages } from '../../lib/messages'
import { getApplicationExternalData } from '../../utils/newPrimarySchoolUtils'

export const childrenSubSection = buildSubSection({
  id: 'childrenSubSection',
  title: newPrimarySchoolMessages.pre.childrenSubSectionTitle,
  children: [
    buildMultiField({
      id: 'childrenMultiField',
      title: newPrimarySchoolMessages.pre.childrenSubSectionTitle,
      description: newPrimarySchoolMessages.pre.childrenDescription,
      children: [
        buildRadioField({
          id: 'childNationalId',
          title: newPrimarySchoolMessages.pre.childrenRadioTitle,
          options: (application) => {
            const { children } = getApplicationExternalData(
              application.externalData,
            )

            return children.map((child, index) => {
              return {
                value: child.nationalId,
                label: child.fullName,
                subLabel: formatKennitala(child.nationalId),
                dataTestId: `child-${index}`,
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
              name: newPrimarySchoolMessages.pre.startApplication,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
