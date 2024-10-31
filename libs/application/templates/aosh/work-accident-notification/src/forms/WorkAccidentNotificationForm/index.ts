import { buildForm } from '@island.is/application/core'
import { Form, FormModes, Section } from '@island.is/application/types'
import { informationSection } from './InformationSection'
import { Logo } from '../../assets/Logo'

import { accidentSection } from './AccidentSection'
import { EmployeeAndAccidentInformationSection } from '../RepeatableSection'
import { overviewSection } from './OverviewSection'
import { announcementSection } from './AnnouncementSection'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { conclusion } from '../../lib/messages'

const buildRepeatableSections = (): Section[] => {
  const sections = [...Array(20)].map((_key, index) => {
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
  renderLastScreenBackButton: false,
  children: [
    announcementSection,
    informationSection,
    accidentSection,
    ...buildRepeatableSections(),
    overviewSection,
    buildFormConclusionSection({
      sectionTitle: conclusion.general.sectionTitle,
      multiFieldTitle: conclusion.general.title,
      alertTitle: conclusion.default.alertTitle,
      expandableHeader: conclusion.default.accordionTitle,
      expandableIntro: '',
      expandableDescription: conclusion.default.accordionText,
    }),
  ],
})
