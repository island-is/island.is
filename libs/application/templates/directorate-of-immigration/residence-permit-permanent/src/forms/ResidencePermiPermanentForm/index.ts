import { buildForm, buildSection } from '@island.is/application/core'
import { Form, FormModes, Section } from '@island.is/application/types'
import { confirmation, externalData } from '../../lib/messages'
import { InformationSection } from './InformationSection'
import { PaymentSection } from './PaymentSection'
import { Logo } from '../../assets/Logo'

const buildInformationSections = (): Section[] =>
  [...Array(2)].map((_key, index) => InformationSection(index))

export const ResidencePermitPermanentForm: Form = buildForm({
  id: 'ResidencePermitPermanentFormDraft',
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
    ...buildInformationSections(),
    PaymentSection,
    buildSection({
      id: 'confirmation',
      title: confirmation.general.sectionTitle,
      children: [],
    }),
  ],
})
