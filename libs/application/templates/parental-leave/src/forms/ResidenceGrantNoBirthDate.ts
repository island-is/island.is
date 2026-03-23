import {
  buildForm,
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents, Form } from '@island.is/application/types'
import { DirectorateOfLabourLogo } from '@island.is/application/assets/institution-logos'
import { parentalLeaveFormMessages } from '../lib/messages'
import { getApplicationExternalData } from '../lib/parentalLeaveUtils'

export const ResidenceGrantNoBirthDate: Form = buildForm({
  id: 'residenceGrantApplicationNoBirthDate',
  title:
    parentalLeaveFormMessages.residenceGrantMessage.residenceGrantClosedTitle,
  logo: DirectorateOfLabourLogo,
  renderLastScreenButton: true,
  children: [
    buildSection({
      id: 'residenceGrantApplicationNoBirthDate.section',
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
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  name: parentalLeaveFormMessages.confirmation.cancel,
                  event: DefaultEvents.REJECT,
                  type: 'reject',
                },
                {
                  name: parentalLeaveFormMessages.residenceGrantMessage
                    .residenceGrantApplyTitle,
                  event: DefaultEvents.APPROVE,
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
          ],
        }),
      ],
    }),
  ],
})
