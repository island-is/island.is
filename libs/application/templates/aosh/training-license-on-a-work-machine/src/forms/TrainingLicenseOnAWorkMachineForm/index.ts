import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { AoshLogo } from '@island.is/application/assets/institution-logos'
import { informationSection } from './InformationSection'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { conclusion } from '../../lib/messages'
import { certificateOfTenureSection } from './CertificateOfTenureSection'
import { assigneeInformationSection } from './AssigneeInformationSection'
import { overviewSection } from './OverviewSection'

export const TrainingLicenseOnAWorkMachineForm: Form = buildForm({
  id: 'TrainingLicenseOnAWorkMachineFormsDraft',
  title: '',
  logo: AoshLogo,
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
