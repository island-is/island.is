import { buildForm, Form, FormModes } from '@island.is/application/core'
import Logo from '../../assets/Logo'
import { application } from '../../lib/messages'

import { aboutTheAccidentSection } from './aboutTheAccidentSection'
import { applicantInformationSection } from './applicantInformationSection'
import { conclusionSection } from './conclusionSection'
import { externalDataSection } from './externalDataSection'
import { overviewSection } from './overviewSection'
import { whoIsTheNotificationForSection } from './whoIsTheNotificationForSection'
import { betaTestSection } from './betaTestSection'

export const AccidentNotificationForm: Form = buildForm({
  id: 'AccidentNotificationForm',
  title: application.general.name,
  logo: Logo,
  mode: FormModes.APPLYING,
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
