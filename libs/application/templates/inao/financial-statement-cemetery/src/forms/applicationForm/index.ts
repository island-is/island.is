import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { m } from '../../lib/messages'
import { cemeteryKeyNumbersSection } from './cemeteryKeyNumbersSection'
import { cemeteryCaretekerSection } from './cemeteryCaretakerSection'
import { cemeteryFinancialStatementSection } from './cemeteryFinancialStatementSection'
import Logo from '../../components/Logo'
import { clientInfoSection } from './clientInfoSection'
import { overviewSection } from './overviewSection'

export const FinancialStatementCemeteryForm: Form = buildForm({
  id: 'FinancialStatementCemeteryForm',
  title: m.applicationTitle,
  mode: FormModes.DRAFT,
  renderLastScreenButton: false,
  logo: Logo,
  children: [
    clientInfoSection,
    cemeteryKeyNumbersSection,
    cemeteryCaretekerSection,
    cemeteryFinancialStatementSection,
    overviewSection,
  ],
})
