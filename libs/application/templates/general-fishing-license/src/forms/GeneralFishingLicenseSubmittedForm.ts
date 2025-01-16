import { buildForm } from '@island.is/application/core'
import { Form } from '@island.is/application/types'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { Logo } from '../assets'
import { conclusion } from '../lib/messages'

export const GeneralFishingLicenseSubmittedForm: Form = buildForm({
  id: 'GeneralFishingLicenseSubmittedForm',
  logo: Logo,
  children: [
    buildFormConclusionSection({
      alertTitle: conclusion.general.title,
      expandableHeader: conclusion.information.title,
      expandableDescription: conclusion.information.bulletList,
    }),
  ],
})
