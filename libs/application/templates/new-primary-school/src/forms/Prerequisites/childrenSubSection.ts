import {
  buildMultiField,
  buildRadioField,
  buildSubSection,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import setMonth from 'date-fns/setMonth'
import startOfMonth from 'date-fns/startOfMonth'
import { format as formatKennitala, info } from 'kennitala'
import { prerequisitesMessages } from '../../lib/messages'
import { FIRST_GRADE_AGE } from '../../utils/constants'
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

            // Enrollment to 1st grade should only be accessable from 1 Feb to 15 Sep each year
            const today = new Date()
            const enrollmentStartDate = startOfMonth(setMonth(today, 1)) // 1 Feb

            const currentYear = today.getFullYear()
            const firstGradeYear = currentYear - FIRST_GRADE_AGE

            return children.map((child, index) => {
              const nationalId = child.nationalId || ''
              const nationalIdInfo = info(nationalId)
              const yearOfBirth = nationalIdInfo?.birthday?.getFullYear()

              return {
                value: child.nationalId,
                label: child.fullName,
                subLabel: formatKennitala(child.nationalId),
                dataTestId: `child-${index}`,
                // Disable if child is a first grader and enrollment has not opened yet
                disabled:
                  yearOfBirth === firstGradeYear && today < enrollmentStartDate,
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
