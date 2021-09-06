import {
  buildCustomField,
  buildForm,
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildSubmitField,
  Form,
  FormModes,
  coreMessages,
} from '@island.is/application/core'

import Logo from '../assets/Logo'
import { employerFormMessages } from '../lib/messages'

export const EmployerApproval: Form = buildForm({
  id: 'EmployerApprovalForParentalLeave',
  title: employerFormMessages.formTitle,
  logo: Logo,
  mode: FormModes.REVIEW,
  children: [
    buildSection({
      id: 'review',
      title: employerFormMessages.reviewSection,
      children: [
        buildMultiField({
          id: 'multi',
          title: employerFormMessages.reviewMultiTitle,
          children: [
            buildCustomField(
              {
                id: 'timeline',
                title: employerFormMessages.reviewMultiTitle,
                component: 'PeriodsRepeater',
              },
              {
                editable: false,
                showDescription: false,
              },
            ),
            buildCustomField({
              id: 'unionAndPensionInfo',
              title: '',
              component: 'EmployerApprovalExtraInformation',
            }),
            buildSubmitField({
              id: 'submit',
              title: coreMessages.buttonSubmit,
              placement: 'footer',
              actions: [
                {
                  name: employerFormMessages.buttonReject,
                  type: 'subtle',
                  event: 'REJECT',
                },
                {
                  name: coreMessages.buttonApprove,
                  type: 'primary',
                  event: 'APPROVE',
                },
              ],
            }),
          ],
        }),
        buildDescriptionField({
          id: 'final',
          title: coreMessages.thanks,
          description: coreMessages.thanksDescription,
        }),
      ],
    }),
  ],
})
