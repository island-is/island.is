import { buildForm } from '@island.is/application/core'
import { m } from '../../lib/messages'
import { Form, FormModes } from '@island.is/application/types'
import Logo from '../../components/Logo'
import { clientInfoSection } from './clientInfoSection'
import { keyNumbersSection } from './keyNumbersSection'
import { financialStatementSection } from './financialStatementSection'
import { overviewSection } from './overviewSection'
import { conclusionSection } from './conclusionSection'

export const FinancialStatementPoliticalPartyForm: Form = buildForm({
  id: 'FinancialStatementPoliticalPartyForm',
  title: m.applicationTitle,
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  logo: Logo,
  children: [
    clientInfoSection,
    keyNumbersSection,
    financialStatementSection,
    overviewSection,
    conclusionSection,
  ],
})
