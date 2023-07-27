import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { application, submitted } from '../lib/messages'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'

export const FundingGovernmentProjectsFormSubmitted: Form = buildForm({
  id: 'FundingGovernmentProjectsFormSubmitted',
  title: application.name,
  mode: FormModes.APPROVED,
  children: [
    buildFormConclusionSection({
      alertTitle: submitted.general.alertTitle,
      expandableHeader: submitted.labels.title,
      expandableIntro: submitted.labels.intro,
      expandableDescription: submitted.labels.bulletList,
    }),
  ],
})
