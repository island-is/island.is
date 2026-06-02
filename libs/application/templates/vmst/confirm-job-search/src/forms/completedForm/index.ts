import { buildForm } from '@island.is/application/core'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { FormModes } from '@island.is/application/types'
import { conclusion as cm } from '../../lib/messages'
import { getNextConfirmationPeriod } from '../../utils/dateUtils'
import { DirectorateOfLabourLogo } from '@island.is/application/assets/institution-logos'

export const completedForm = buildForm({
  id: 'completedForm',
  mode: FormModes.COMPLETED,
  logo: DirectorateOfLabourLogo,
  children: [
    buildFormConclusionSection({
      alertTitle: cm.completedFormAlertTitle,
      multiFieldTitle: cm.multiFieldTitle,
      alertMessage: '',
      accordion: true,
      expandableIntro: {
        ...cm.expandableIntro,
        values: { period: getNextConfirmationPeriod() },
      },
      expandableHeader: cm.expandableHeader,
      expandableDescription: '',
      descriptionFieldTitle: cm.completedFormDescriptionFieldTitle,
      descriptionFieldDescription: cm.descriptionFieldDescription,
      bottomButtonMessage: cm.bottomButtonMessage,
      bottomButtonLabel: cm.bottomButtonLabel,
    }),
  ],
})
