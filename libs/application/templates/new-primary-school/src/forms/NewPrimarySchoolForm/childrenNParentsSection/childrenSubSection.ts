import {
  buildMultiField,
  buildRadioField,
  buildSubSection,
} from '@island.is/application/core'
import { format as formatKennitala } from 'kennitala'
import { newPrimarySchoolMessages } from '../../../lib/messages'
import {
  canApply,
  getApplicationExternalData,
} from '../../../lib/newPrimarySchoolUtils'

export const childrenSubSection = buildSubSection({
  id: 'childrenSubSection',
  title: newPrimarySchoolMessages.childrenNParents.childrenSubSectionTitle,
  children: [
    buildMultiField({
      id: 'childrenMultiField',
      title: newPrimarySchoolMessages.childrenNParents.childrenSubSectionTitle,
      description:
        newPrimarySchoolMessages.childrenNParents.childrenDescription,
      children: [
        buildRadioField({
          id: 'childNationalId',
          title: newPrimarySchoolMessages.childrenNParents.childrenRadioTitle,
          options: (application) => {
            const { children } = getApplicationExternalData(
              application.externalData,
            )

            return children
              .filter((child) => canApply(child))
              .map((child) => {
                return {
                  value: child.nationalId,
                  label: child.fullName,
                  subLabel: formatKennitala(child.nationalId),
                }
              })
          },
          required: true,
        }),
      ],
    }),
  ],
})
