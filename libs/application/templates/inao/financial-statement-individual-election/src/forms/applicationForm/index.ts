import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { Logo } from '../../components/Logo'
import { m } from '../../lib/messages'
import { clientInfoSection } from './clientInfoSection'
import { individualKeyNumbersSection } from './individualKeyNumbersSection'
import { documentsSection } from './documentsSection'
import { overviewSection } from './overviewSection'
import { overviewUnderLimitSection } from './overviewUnderLimitSection'
import { selectElectionSection } from './selectElectionSection'
import { financialLimitSection } from './financialLimitSection'

export const FinancialStatementIndividualElectionForm: Form = buildForm({
  id: 'FinancialStatementIndividualelectionForm',
  title: m.applicationTitle,
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  logo: Logo,
  children: [
    clientInfoSection,
    selectElectionSection,
    financialLimitSection,
    individualKeyNumbersSection,
    documentsSection,
    overviewSection,
    overviewUnderLimitSection,
  ],
})
