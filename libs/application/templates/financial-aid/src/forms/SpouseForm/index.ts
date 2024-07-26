import { buildForm } from '@island.is/application/core'
import { Application, Form, FormModes } from '@island.is/application/types'
import * as m from '../../lib/messages'
import { spouseIncomeSection } from './spouseIncomeSection'
import { spouseIncomeFilesSection } from './spouseIncomeFilesSection'
import { spouseTaxReturnFilesSection } from './spouseTaxReturnFilesSection'
import { spouseContactInfoSection } from './spouseContactInfoSection'
import { spouseSummarySection } from './spouseSumarySection'
import { spouseConfirmationSection } from './spouseConfirmationSection'
import { createElement } from 'react'
import { Logo } from '../../components/Logo/Logo'

export const spouseForm: Form = buildForm({
  id: 'FinancialAidApplication',
  title: m.application.name,
  mode: FormModes.IN_PROGRESS,
  logo: (application: Application) => {
    const logo = createElement(Logo, { application })
    return () => logo
  },
  children: [
    spouseIncomeSection,
    spouseIncomeFilesSection,
    spouseTaxReturnFilesSection,
    spouseContactInfoSection,
    spouseSummarySection,
    spouseConfirmationSection,
  ],
})
