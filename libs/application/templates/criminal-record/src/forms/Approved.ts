import {
  buildForm,
  buildDescriptionField,
  buildMultiField,
  buildCustomField,
  Form,
  FormModes,
  buildSection,
} from '@island.is/application/core'
import { m } from '../lib/messages'
import Logo from '../assets/Logo'

export const Approved: Form = buildForm({
  id: 'ApprovedApplicationForm',
  title: '',
  logo: Logo,
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'externalData',
      title: m.externalDataSection,
      children: [],
    }),
    buildSection({
      id: 'payment',
      title: m.payment,
      children: [],
    }),
    buildSection({
      id: 'confirmation',
      title: m.confirmation,
      children: [
        buildMultiField({
          id: 'confirmation.info',
          title: m.confirmation,
          space: 1,
          children: [
            buildCustomField(
              {
                component: 'SuccessMessageField',
                id: 'successMessage',
                title: m.confirmation,
                description: m.successDescription,
              },
              {
                successTitle: m.successTitle,
                marginTop: 0,
              },
            ),
            buildCustomField(
              {
                component: 'InfoMessageField',
                id: 'infoMessage',
                title: '',
                description: 'Nánari upplýsingar um sannreyningu má finna á',
              },
              {
                link: {
                  title: ' island.is/sannreyna',
                  url: 'island.is/sannreyna',
                },
              },
            ),
          ],
        }),
      ],
    }),
  ],
})
