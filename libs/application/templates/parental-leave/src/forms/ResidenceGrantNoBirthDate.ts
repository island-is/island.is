import {
  buildCustomField,
  buildDescriptionField,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { Form } from '@island.is/application/types'

import Logo from '../assets/Logo'
import { parentalLeaveFormMessages } from '../lib/messages'
import { getApplicationExternalData } from '../lib/parentalLeaveUtils'

export const ResidenceGrantNoBirthDate: Form = buildForm({
  id: 'residenceGrantApplicationNoBirthDate',
  title:
    parentalLeaveFormMessages.residenceGrantMessage.residenceGrantClosedTitle,
  logo: Logo,
  children: [
    buildSection({
      id: 'residenceGrantApplicationNoBirthDate.section',
      title: '',

      children: [
        buildMultiField({
          title: (application) => {
            const { dateOfBirth } = getApplicationExternalData(
              application.externalData,
            )
            if (dateOfBirth?.data?.dateOfBirth)
              return parentalLeaveFormMessages.residenceGrantMessage
                .residenceGrantOpenTitle
            return parentalLeaveFormMessages.residenceGrantMessage
              .residenceGrantClosedTitle
          },
          id: 'residenceGrantApplicationNoBirthDate.multi',
          description: (application) => {
            const { dateOfBirth } = getApplicationExternalData(
              application.externalData,
            )
            if (dateOfBirth?.data?.dateOfBirth)
              return parentalLeaveFormMessages.residenceGrantMessage
                .residenceGrantOpenDescription
            return parentalLeaveFormMessages.residenceGrantMessage
              .residenceGrantClosedDescription
          },

          children: [
            buildSubmitField({
              id: 'residenceGrantApplicationNoBirthDate.reject',
              placement: 'footer',
              title: '',
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  name: parentalLeaveFormMessages.confirmation.cancel,
                  event: 'REJECT',
                  type: 'reject',
                },
                {
                  name: parentalLeaveFormMessages.residenceGrantMessage
                    .residenceGrantApplyTitle,
                  event: 'APPROVE',
                  type: 'primary',
                  condition: (_, externalData) => {
                    const { dateOfBirth } =
                      getApplicationExternalData(externalData)
                    if (dateOfBirth?.data?.dateOfBirth) return true
                    return false
                  },
                },
              ],
            }),
            buildCustomField({
              id: 'residenceGrantApplicationNoBirthDate.image',
              title: '',
              defaultValue: 1,
              component: 'ImageField',
            }),
          ],
        }),
        buildDescriptionField({
          id: 'unused',
          title: '',
          description: '',
        }),
      ],
    }),
  ],
})
