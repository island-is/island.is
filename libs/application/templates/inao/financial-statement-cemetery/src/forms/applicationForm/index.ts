import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { m } from '../../lib/messages'
import { cemeteryKeyNumbersSection } from './cemeteryKeyNumbersSection'
import { cemeteryCaretekerSection } from './cemeteryCaretakerSection'
import { cemeteryFinancialStatementSection } from './cemeteryFinancialStatementSection'
import { InaoLogo } from '@island.is/application/assets/institution-logos'
import { clientInfoSection } from './clientInfoSection'
import { overviewSection } from './overviewSection'
import { conclusionSection } from './conclusionSection/conclusionSection'

export const FinancialStatementCemeteryForm: Form = buildForm({
  id: 'FinancialStatementCemeteryForm',
  title: m.applicationTitle,
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  logo: InaoLogo,
  children: [
    clientInfoSection,
    cemeteryKeyNumbersSection,
    cemeteryCaretekerSection,
    cemeteryFinancialStatementSection,
    overviewSection,
    conclusionSection,
  ],
})
