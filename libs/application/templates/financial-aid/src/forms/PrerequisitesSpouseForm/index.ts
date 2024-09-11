import { buildForm } from '@island.is/application/core'
import { Application, Form, FormModes } from '@island.is/application/types'
import * as m from '../../lib/messages'
import { prerequisitesSection } from './prerequisitesSection'
import { informationSection } from './informationSection'
import { createElement } from 'react'
import { Logo } from '../../components/Logo/Logo'

export const PrerequisitesSpouseForm: Form = buildForm({
  id: 'FinancialAidApplication',
  title: m.application.name,
  renderLastScreenButton: true,
  mode: FormModes.IN_PROGRESS,
  logo: (application: Application) => {
    const logo = createElement(Logo, { application })
    return () => logo
  },
  children: [prerequisitesSection, informationSection],
})
