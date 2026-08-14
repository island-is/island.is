import { buildForm } from '@island.is/application/core'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { FormModes } from '@island.is/application/types'
import { DistrictCommissionersLogo } from '@island.is/application/assets/institution-logos'
import { m } from '../../lib/messages'

export const completedForm = buildForm({
  id: 'completedForm',
  title: m.overviewSectionTitle,
  logo: DistrictCommissionersLogo,
  mode: FormModes.COMPLETED,
  children: [
    buildFormConclusionSection({
      tabTitle: m.applicationForDrivingLicense,
      multiFieldTitle: m.applicationDone,
      alertTitle: m.applicationCompleteAlertTitle,
      alertMessage: m.applicationCompleteAlertMessage,
    }),
  ],
})
