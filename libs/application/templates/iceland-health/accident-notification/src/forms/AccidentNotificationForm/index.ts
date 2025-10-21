import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import Logo from '../../assets/Logo'
import { application } from '../../lib/messages'
import { conclusionSection } from './conclusionSection'
import { overviewSection } from './overviewSection'
import { applicantInformationSection } from './applicantInformationSection'
import { whoIsTheNotificationForSection } from './whoIsTheNotificationForSection'
import { aboutTheAccidentSection } from './aboutTheAccidentSection'

export const AccidentNotificationForm: Form = buildForm({
  id: 'AccidentNotificationForm',
  title: application.general.name,
  logo: Logo,
  mode: FormModes.DRAFT,
  children: [
    applicantInformationSection,
    whoIsTheNotificationForSection,
    aboutTheAccidentSection,
    overviewSection,
    conclusionSection,
  ],
})
