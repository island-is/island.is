import { buildForm } from '@island.is/application/core'
import { m } from '../../lib/messages'
import { Form, FormModes } from '@island.is/application/types'
import { clientInfoSection } from './clientInfoSection'
import { keyNumbersSection } from './keyNumbersSection'
import { financialStatementSection } from './keyNumbersSection/financialStatementSection'
import { overviewSection } from './keyNumbersSection/overviewSection'
import Logo from '../../../../shared/components/Logo'

export const FinancialStatementPoliticalPartyForm: Form = buildForm({
  id: 'FinancialStatementPoliticalPartyForm',
  title: m.applicationTitle,
  mode: FormModes.DRAFT,
  renderLastScreenButton: false,
  logo: () => Logo({ serviceProvider: m.serviceProvider, inao: m.inao }),
  children: [
    clientInfoSection,
    keyNumbersSection,
    financialStatementSection,
    overviewSection,
  ],
})
