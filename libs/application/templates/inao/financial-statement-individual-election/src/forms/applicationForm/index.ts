import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { m } from '../../lib/utils/messages'
import { clientInfoSection } from './clientInfoSection'
import { electionInfoSection } from './electionInfoSection'
import { individualKeyNumbersSection } from './individualKeyNumbersSection'
import { documentsSection } from './documentsSection'
import { overviewSection } from './overviewSection'
import Logo from '../../../../shared/components/Logo'

export const FinancialStatementIndividualElectionForm: Form = buildForm({
  id: 'FinancialStatementIndividualelectionForm',
  title: m.applicationTitle,
  mode: FormModes.DRAFT,
  renderLastScreenButton: false,
  logo: () => Logo({ serviceProvider: m.serviceProvider, inao: m.inao }),
  children: [
    clientInfoSection,
    electionInfoSection,
    individualKeyNumbersSection,
    documentsSection,
    overviewSection,
  ],
})
