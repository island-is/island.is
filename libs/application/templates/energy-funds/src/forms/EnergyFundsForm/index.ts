import { buildForm, buildSection } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { externalData } from '../../lib/messages'
import { Logo } from '../../assets/Logo'
import { InformationSection } from './InformationSection'
import { GrantSection } from './GrantSection'
import { confirmation } from '../../lib/messages/confirmation'

export const EnergyFundsForm: Form = buildForm({
  id: 'EnergyFundsFormDraft',
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
    InformationSection,
    GrantSection,
    buildSection({
      id: 'confirmation',
      title: confirmation.general.sectionTitle,
      children: [],
    }),
  ],
})
