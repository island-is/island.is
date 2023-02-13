import { buildForm } from '@island.is/application/core'
import { Form } from '@island.is/application/types'
import { formConclusionSection } from '@island.is/application/ui-forms'
import { Logo } from '../assets'
import { conclusion } from '../lib/messages'

export const GeneralFishingLicenseSubmittedForm: Form = buildForm({
  id: 'GeneralFishingLicenseSubmittedForm',
  title: '',
  logo: Logo,
  children: [
    formConclusionSection({
      alertTitle: conclusion.general.title,
      expandableHeader: conclusion.information.title,
      expandableDescription: conclusion.information.bulletList,
    }),
  ],
})
