import { buildForm } from '@island.is/application/core'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { FormModes } from '@island.is/application/types'
import { application as am } from './../../lib/messages'

export const completedForm = buildForm({
  id: 'completedForm',
  mode: FormModes.COMPLETED,
  children: [
    buildFormConclusionSection({
      multiFieldTitle: am.multiFieldTitle,
      alertTitle: am.completedFormAlertTitle,
      alertMessage: '',
      expandableHeader: am.expandableHeader,
      expandableIntro: '',
      expandableDescription: am.expandableDescription,
      descriptionFieldTitle: am.completedFormDescriptionFieldTitle,
      descriptionFieldDescription: am.completedFormDescriptionFieldDescription,
      bottomButtonLabel: am.bottomButtonLabel,
      bottomButtonMessage: am.bottomButtonMessage,
    }),
  ],
})
