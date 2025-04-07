import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { Logo } from '../../assets/Logo'
import { informationSection } from './InformationSection'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { conclusion } from '../../lib/messages'
import { certificateOfTenureSection } from './CertificateOfTenureSection'
import { assigneeInformationSection } from './AssigneeInformationSection'
import { overviewSection } from './OverviewSection'
import { isContractor } from '../../utils'

export const TrainingLicenseOnAWorkMachineForm: Form = buildForm({
  id: 'TrainingLicenseOnAWorkMachineFormsDraft',
  title: '',
  logo: Logo,
  mode: FormModes.DRAFT,
  renderLastScreenButton: false,
  renderLastScreenBackButton: false,
  children: [
    informationSection,
    certificateOfTenureSection,
    assigneeInformationSection,
    overviewSection,
    buildFormConclusionSection({
      sectionTitle: conclusion.general.sectionTitle,
      multiFieldTitle: conclusion.general.title,
      alertTitle: conclusion.default.alertMessage,
      alertMessage: '',
      expandableHeader: conclusion.default.expandableHeader,
      expandableIntro: '',
      expandableDescription: conclusion.default.expandableDescription,
    }),
  ],
})
