import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { Logo } from '../../assets/Logo'
import { informationSection } from './InformationSection'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { conclusion } from '../../lib/messages'
import { certificateOfTenureSection } from './CertificateOfTenureSection'
import { assigneeInformationSection } from './AssigneeInformationSection'

export const TrainingLicenseOnAWorkMachineForm: Form = buildForm({
  id: 'TrainingLicenseOnAWorkMachineFormsDraft',
  title: '',
  logo: Logo,
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: false,
  children: [
    informationSection,
    certificateOfTenureSection,
    assigneeInformationSection,
    buildFormConclusionSection({
      sectionTitle: conclusion.general.sectionTitle,
      multiFieldTitle: conclusion.general.title,
      alertTitle: conclusion.default.accordionTitle,
      expandableHeader: conclusion.default.expandableHeader,
      expandableDescription: conclusion.default.expandableDescription,
    }),
  ],
})
