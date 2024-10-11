import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import Logo from '../../assets/Logo'
import { application } from '../../lib/messages'

import { conclusionSection } from './conclusionSection'

import { overviewSection } from './overviewSection'
import { betaTestSection } from './betaTestSection'
import { applicantInformationSection } from './applicantInformationSection'
import { whoIsTheNotificationForSection } from './whoIsTheNotificationForSection'
import { externalDataSection } from './externalDataSection'
import { aboutTheAccidentSection } from './aboutTheAccidentSection'

export const AccidentNotificationForm: Form = buildForm({
  id: 'AccidentNotificationForm',
  title: application.general.name,
  logo: Logo,
  mode: FormModes.DRAFT,
  children: [
    betaTestSection,
    externalDataSection,
    applicantInformationSection,
    whoIsTheNotificationForSection,
    aboutTheAccidentSection,
    overviewSection,
    conclusionSection,
  ],
})
