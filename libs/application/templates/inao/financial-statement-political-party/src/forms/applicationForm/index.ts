import { buildForm } from '@island.is/application/core'
import { m } from '../../lib/messages'
import { Form, FormModes } from '@island.is/application/types'
import Logo from '../../components/Logo'
import { clientInfoSection } from './clientInfoSection'
import { keyNumbersSection } from './keyNumbersSection'
import { financialStatementSection } from './keyNumbersSection/financialStatementSection'
import { overviewSection } from './keyNumbersSection/overviewSection'

export const FinancialStatementPoliticalPartyForm: Form = buildForm({
  id: 'FinancialStatementPoliticalPartyForm',
  title: m.applicationTitle,
  mode: FormModes.DRAFT,
  renderLastScreenButton: false,
  logo: Logo,
  children: [
    clientInfoSection,
    keyNumbersSection,
    financialStatementSection,
    overviewSection,
  ],
})
