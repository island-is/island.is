import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { overview } from '../lib/messages'
import { formConclusionSection } from '@island.is/application/ui-forms'

export const overviewForm: Form = buildForm({
  id: 'OverviewForm',
  title: overview.sectionTitle,
  mode: FormModes.COMPLETED,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    formConclusionSection({
      alertMessage: overview.alertMessage,
      alertTitle: overview.alertTitle,
      buttonText: overview.buttonText,
      expandableDescription: overview.expandableDescription,
      expandableHeader: overview.expandeableHeader,
    }),
  ],
})
