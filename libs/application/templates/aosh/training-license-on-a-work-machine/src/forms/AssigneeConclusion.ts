import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { conclusion } from '../lib/messages'
import { Logo } from '../assets/Logo'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'

export const AssigneeConclusion: Form = buildForm({
  id: 'AssigneeConclusionApplicationForm',
  title: '',
  logo: Logo,
  mode: FormModes.COMPLETED,
  children: [
    buildFormConclusionSection({
      sectionTitle: conclusion.general.sectionTitle,
      multiFieldTitle: conclusion.general.title,
      alertTitle: conclusion.approvedForAssignee.alertMessage,
      alertMessage: '',
      expandableHeader: conclusion.approvedForAssignee.expandableHeader,
      expandableIntro: '',
      expandableDescription:
        conclusion.approvedForAssignee.expandableDescription,
    }),
  ],
})
