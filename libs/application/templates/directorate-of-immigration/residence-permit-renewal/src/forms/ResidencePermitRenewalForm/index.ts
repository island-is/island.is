import { buildForm, buildSection } from '@island.is/application/core'
import { Form, FormModes, Section } from '@island.is/application/types'
import { confirmation, externalData, payment } from '../../lib/messages'
import { PersonalSection } from './PersonalSection'
import { ApplicantSection } from './ApplicantSection'
import { InformationSection } from './InformationSection'
import { AgentSection } from './AgentSection'
import { ExpeditedProcessingSection } from './ExpeditedProcessingSection'
import { Logo } from '../../assets/Logo'
import { MAX_CNT_APPLICANTS } from '../../shared'
import { buildFormPaymentChargeOverviewSection } from '@island.is/application/ui-forms'
import { getChargeItemCodes } from '../../utils'

const buildInformationSections = (): Section[] => {
  return [...Array(MAX_CNT_APPLICANTS)].map((_key, index) =>
    InformationSection(index),
  )
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
    buildFormPaymentChargeOverviewSection({
      sectionTitle: payment.general.sectionTitle,
      getSelectedChargeItems: (_) =>
        getChargeItemCodes().map((x) => ({
          chargeItemCode: x,
        })),
    }),
    buildSection({
      id: 'confirmation',
      title: confirmation.general.sectionTitle,
      children: [],
    }),
  ],
})
