import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { buildForm } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { HmsLogo } from '@island.is/application/assets/institution-logos'
import * as m from '../../lib/messages'

export const completedForm = buildForm({
  id: 'completedForm',
  logo: HmsLogo,
  mode: FormModes.COMPLETED,
  renderLastScreenBackButton: false,
  children: [
    buildFormConclusionSection({
      alertTitle: m.completed.alertMessageSuccessTitle,
      alertMessage: m.completed.alertMessageSuccessDescription,
      expandableHeader: m.completed.pageInfoTitle,
      expandableIntro: m.completed.pageInfoBullet1,
      expandableDescription: m.completed.pageInfoBullet2,
      multiFieldTitle: m.completed.sectionName,
      sectionTitle: '',
      tabTitle: m.completed.sectionName,
    }),
  ],
})
