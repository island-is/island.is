import { buildForm } from '@island.is/application/core'
import { m } from '../../lib/messages'
import { Form, FormModes } from '@island.is/application/types'
import { InaoLogo } from '@island.is/application/assets/institution-logos'
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
  logo: InaoLogo,
  children: [
    clientInfoSection,
    keyNumbersSection,
    financialStatementSection,
    overviewSection,
    conclusionSection,
  ],
})
