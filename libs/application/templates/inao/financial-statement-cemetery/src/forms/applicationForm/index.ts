import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { m } from '../../lib/messages'
import { cemeteryKeyNumbersSection } from './cemeteryKeyNumbersSection'
import { cemeteryCaretekerSection } from './cemeteryCaretakerSection'
import { cemeteryFinancialStatementSection } from './cemeteryFinancialStatementSection'
import { clientInfoSection } from './clientInfoSection'
import { overviewSection } from './overviewSection'
import Logo from '../../../../shared/components/Logo'

export const FinancialStatementCemeteryForm: Form = buildForm({
  id: 'FinancialStatementCemeteryForm',
  title: m.applicationTitle,
  mode: FormModes.DRAFT,
  renderLastScreenButton: false,
  logo: () => Logo({ serviceProvider: m.serviceProvider, inao: m.inao }),
  children: [
    clientInfoSection,
    cemeteryKeyNumbersSection,
    cemeteryCaretekerSection,
    cemeteryFinancialStatementSection,
    overviewSection,
  ],
})
