import { buildForm, buildSection } from '@island.is/application/core'
import {
  Application,
  Form,
  FormModes,
  Section,
} from '@island.is/application/types'
import { confirmation, externalData } from '../../lib/messages'
import { PersonalSection } from './PersonalSection'
import { ApplicantSection } from './ApplicantSection'
import { InformationSection } from './InformationSection'
import { AgentSection } from './AgentSection'
import { ExpeditedProcessingSection } from './ExpeditedProcessingSection'
import { PaymentSection } from './PaymentSection'
import { Logo } from '../../assets/Logo'

const buildInformationSections = (): Section[] => {
  // TODOx look at answer to know how many times should be repeated
  return [...Array(2)].map((_key, index) => InformationSection(index))
}

export const ResidencePermitRenewalForm: Form = buildForm({
  id: 'ResidencePermitRenewalFormDraft',
  title: '',
  logo: Logo,
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    buildSection({
      id: 'externalData',
      title: externalData.dataProvider.sectionTitle,
      children: [],
    }),
    PersonalSection,
    ApplicantSection,
    ...buildInformationSections(),
    AgentSection,
    ExpeditedProcessingSection,
    PaymentSection,
    buildSection({
      id: 'confirmation',
      title: confirmation.general.sectionTitle,
      children: [],
    }),
  ],
})
