import { buildForm } from '@island.is/application/core'
import * as m from '../../lib/messages'
import { Application, Form, FormModes } from '@island.is/application/types'
import { financesSection } from './financesSection'
import { contactInfoSection } from './contactInfoSection'
import { summarySection } from './summarySection'
import { confirmationSection } from './confirmationSection'
import { Logo } from '../../components/Logo/Logo'
import { createElement } from 'react'
import { personalInterestSection } from './personalInterestSection'

export const ApplicationForm: Form = buildForm({
  id: 'FinancialAidApplication',
  title: m.application.name,
  mode: FormModes.DRAFT,
  logo: (application: Application) => {
    const logo = createElement(Logo, { application })
    return () => logo
  },
  children: [
    personalInterestSection,
    financesSection,
    contactInfoSection,
    summarySection,
    confirmationSection,
  ],
})
