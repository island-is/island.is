import { buildForm, buildSection } from '@island.is/application/core'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { Form, FormModes } from '@island.is/application/types'
import { m } from '../lib/messages'
import Logo from '../assets/Logo'

export const Approved: Form = buildForm({
  id: 'ApprovedApplicationForm',
  logo: Logo,
  mode: FormModes.APPROVED,
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
    buildFormConclusionSection({
      sectionTitle: m.confirmation,
      alertTitle: m.successTitle,
      alertMessage: m.successAlertMessageDescription,
      alertLinks: [
        {
          title: m.successAlertMessageLinkText,
          url: '/minarsidur/postholf',
          isExternal: false,
        },
      ],
      expandableIntro: '',
      expandableDescription: m.vertificationDescriptionWithLink,
    }),
  ],
})
