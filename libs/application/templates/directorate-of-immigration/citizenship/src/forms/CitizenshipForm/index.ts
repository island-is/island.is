import { buildForm, buildSection } from '@island.is/application/core'
import { Form, FormModes, Section } from '@island.is/application/types'
import { confirmation, externalData } from '../../lib/messages'
import { InformationSection } from './InformationSection'
import { PaymentSection } from './PaymentSection'
import { PersonalSection } from './PersonalSection'
import { SupportingDocumentsSection } from './SupportingDocumentsSection'
import { Logo } from '../../assets/Logo'
import { MAX_CNT_APPLICANTS } from '../../shared'

const buildSupportingDocumentsSections = (): Section[] => {
  return [...Array(MAX_CNT_APPLICANTS)].map((_key, index) =>
    SupportingDocumentsSection(index),
  )
}

export const CitizenshipForm: Form = buildForm({
  id: 'CitizenshipFormDraft',
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
    InformationSection,
    ...buildSupportingDocumentsSections(),
    PaymentSection,
    buildSection({
      id: 'confirmation',
      title: confirmation.general.sectionTitle,
      children: [],
    }),
  ],
})
