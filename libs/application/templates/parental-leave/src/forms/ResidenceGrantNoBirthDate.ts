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
          title:
            parentalLeaveFormMessages.residenceGrantMessage
              .residenceGrantClosedTitle,
          id: 'residenceGrantApplicationNoBirthDate.multi',
          description:
            parentalLeaveFormMessages.residenceGrantMessage
              .residenceGrantClosedDescription,
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
              ],
            }),
            buildCustomField({
              id: 'residenceGrantApplicationNoBirthDate.image',
              title: '',
              defaultValue: 1,
              component: 'ImageField',
            }),
            buildCustomField({
              id: 'residenceGrantApplicationNoBirthDate.dob',
              title: '',
              component: 'FetchDateOfBirthField',
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
