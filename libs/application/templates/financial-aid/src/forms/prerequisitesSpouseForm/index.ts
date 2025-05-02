import { buildForm } from '@island.is/application/core'
import { Application, Form, FormModes } from '@island.is/application/types'

import * as m from '../../lib/messages'
import { createElement } from 'react'
import { Logo } from '../../components/Logo/Logo'
import { prerequisitesSpouseSection } from './prerequisitesSpouseSection'
import { spouseAcceptContract } from './spouseAcceptContract'

export const PrerequisitesSpouse: Form = buildForm({
  id: 'FinancialAidApplication',
  title: m.application.name,
  mode: FormModes.IN_PROGRESS,
  renderLastScreenButton: true,
  logo: (application: Application) => {
    const logo = createElement(Logo, { application })
    return () => logo
  },
  children: [prerequisitesSpouseSection, spouseAcceptContract],
})
