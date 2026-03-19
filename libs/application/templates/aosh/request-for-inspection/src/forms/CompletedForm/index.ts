import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { conclusion } from '../../lib/messages'
import { AoshLogo } from '@island.is/application/assets/institution-logos'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'

export const completedForm: Form = buildForm({
  id: 'completedForm',
  logo: AoshLogo,
  mode: FormModes.COMPLETED,
  children: [
    buildFormConclusionSection({
      sectionTitle: conclusion.general.sectionTitle,
      multiFieldTitle: conclusion.general.title,
      alertTitle: conclusion.default.alertTitle,
      expandableHeader: conclusion.default.accordionTitle,
      expandableDescription: conclusion.default.accordionText,
    }),
  ],
})
