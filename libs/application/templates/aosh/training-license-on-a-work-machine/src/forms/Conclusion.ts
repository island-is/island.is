import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { conclusion } from '../lib/messages'
import { Logo } from '../assets/Logo'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { isContractor } from '../utils'

export const Conclusion: Form = buildForm({
  id: 'ConclusionApplicationForm',
  title: '',
  logo: Logo,
  mode: FormModes.COMPLETED,
  children: [
    buildFormConclusionSection({
      sectionTitle: conclusion.general.sectionTitle,
      multiFieldTitle: conclusion.general.title,
      alertTitle: conclusion.default.alertMessage,
      alertMessage: '',
      expandableHeader: conclusion.default.expandableHeader,
      expandableIntro: '',
      expandableDescription: conclusion.default.expandableDescription,
      condition: (answers) => !isContractor(answers),
    }),
    buildFormConclusionSection({
      sectionTitle: conclusion.general.sectionTitle,
      multiFieldTitle: conclusion.general.title,
      alertTitle: conclusion.approvedForApplicant.alertMessage,
      alertMessage: '',
      expandableHeader: conclusion.approvedForApplicant.expandableHeader,
      expandableIntro: '',
      expandableDescription:
        conclusion.approvedForApplicant.expandableDescription,
      condition: (answers) => isContractor(answers),
    }),
  ],
})
