import { buildForm } from '@island.is/application/core'
import { Application, Form } from '@island.is/application/types'

import * as m from '../../lib/messages'
import { createElement } from 'react'
import { Logo } from '../../components/Logo/Logo'
import { SpouseStatus } from './SpouseStatus'
import { MissingFiles } from './MissingFiles'
import { MissingFilesConfirmation } from './MissingFilesConfirmation'

export const SpouseSubmitted: Form = buildForm({
  id: 'FinancialAidApplication',
  title: m.status.sectionTitle,
  logo: (application: Application) => {
    const logo = createElement(Logo, { application })
    return () => logo
  },
  children: [SpouseStatus, MissingFiles, MissingFilesConfirmation],
})