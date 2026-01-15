import {
  buildMultiField,
  buildRadioField,
  buildSubSection,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import { format as formatKennitala } from 'kennitala'
import { prerequisitesMessages } from '../../lib/messages'
import { getApplicationExternalData } from '../../utils/newPrimarySchoolUtils'

export const childrenSubSection = buildSubSection({
  id: 'childrenSubSection',
  title: prerequisitesMessages.children.subSectionTitle,
  children: [
    buildMultiField({
      id: 'childrenMultiField',
      title: prerequisitesMessages.children.subSectionTitle,
      description: prerequisitesMessages.children.description,
      children: [
        buildRadioField({
          id: 'childNationalId',
          title: prerequisitesMessages.children.radioTitle,
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
              name: prerequisitesMessages.children.startApplication,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
