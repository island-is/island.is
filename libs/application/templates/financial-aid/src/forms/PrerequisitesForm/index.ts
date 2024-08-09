import { buildForm } from '@island.is/application/core'
import { Application, Form, FormModes } from '@island.is/application/types'
import * as m from '../../lib/messages'
import { externalDataSection } from './externalDataSection'
import { informationSection } from './informationSection'
import { createElement } from 'react'
import { Logo } from '../../components/Logo/Logo'

export const PrerequisitesForm: Form = buildForm({
  id: 'FinancialAidApplication',
  title: m.application.name,
  renderLastScreenButton: true,
  mode: FormModes.DRAFT,
  logo: (application: Application) => {
    const logo = createElement(Logo, { application })
    return () => logo
  },
  children: [externalDataSection, informationSection],
})
