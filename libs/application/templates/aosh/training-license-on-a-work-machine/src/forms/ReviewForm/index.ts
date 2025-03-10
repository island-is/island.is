import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { conclusion } from '../../lib/messages'
import { Logo } from '../../assets/Logo'
import { applicationStatusSection } from './ApplicationStatusSection'
import { reviewOverviewSection } from './ReviewOverviewSection'
import { isRejected } from '../../utils'

export const ReviewForm: Form = buildForm({
  id: 'ReviewForm',
  title: '',
  logo: Logo,
  mode: FormModes.IN_PROGRESS,
  renderLastScreenButton: false,
  renderLastScreenBackButton: false,
  children: [
    applicationStatusSection,
    reviewOverviewSection,
    buildFormConclusionSection({
      sectionTitle: conclusion.general.sectionTitle,
      multiFieldTitle: conclusion.general.title,
      alertTitle: conclusion.approvedForAssignee.alertMessage,
      alertMessage: '',
      expandableHeader: conclusion.approvedForAssignee.expandableHeader,
      expandableIntro: '',
      expandableDescription:
        conclusion.approvedForAssignee.expandableDescription,
      condition: (answers) => !isRejected(answers),
    }),
    buildFormConclusionSection({
      sectionTitle: conclusion.general.sectionTitle,
      alertTitle: conclusion.rejected.alertMessage,
      alertMessage: '',
      multiFieldTitle: conclusion.general.title,
      accordion: false,
      alertType: 'error',
      condition: (answers) => isRejected(answers),
    }),
  ],
})
