import { buildForm } from '@island.is/application/core'
import { Form, FormModes, Section } from '@island.is/application/types'
import { informationSection } from './InformationSection'
import { Logo } from '../../assets/Logo'

import { accidentSection } from './AccidentSection'
import { EmployeeAndAccidentInformationSection } from '../RepeatableSection'
import { announcementSection } from './AnnouncementSection'

const buildRepeatableSections = (): Section[] => {
  const sections = [...Array(2)].map((_key, index) => {
    return EmployeeAndAccidentInformationSection(index)
  })
  return sections.flat()
}

export const WorkAccidentNotificationForm: Form = buildForm({
  id: 'WorkAccidentNotificationFormsDraft',
  title: '',
  logo: Logo,
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    announcementSection,
    informationSection,
    accidentSection,
    ...buildRepeatableSections(),
    //employeeSection,
    //causeAndConsequencesSection,
  ],
})
