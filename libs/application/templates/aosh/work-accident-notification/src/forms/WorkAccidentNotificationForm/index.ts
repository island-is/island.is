import {
  buildDescriptionField,
  buildForm,
  buildHiddenInput,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { Form, FormModes, Section } from '@island.is/application/types'
import { informationSection } from './InformationSection'
import { Logo } from '../../assets/Logo'

import { externalData } from '../../lib/messages'
import { accidentSection } from './AccidentSection'
import { EmployeeAndAccidentInformationSection } from '../RepeatableSection'

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
    buildSection({
      id: 'externalData',
      title: externalData.dataProvider.announcement,
      children: [
        // TODO Add this to its own file ?
        buildMultiField({
          title: externalData.dataProvider.announcement,
          children: [
            buildDescriptionField({
              id: 'externalData.firstHeading',
              title: externalData.dataProvider.announcementHeading,
              titleVariant: 'h4',
              marginBottom: 3,
            }),
            buildDescriptionField({
              id: 'externalData.Description',
              title: '',
              description: externalData.dataProvider.announcementDescription,
              titleVariant: 'h4',
              marginBottom: 3,
            }),
            buildDescriptionField({
              id: 'externalData.secondHeading',
              title: externalData.dataProvider.announcementHeadingSecond,
              titleVariant: 'h4',
              marginBottom: 3,
            }),
            // TODO ADD company national id input here!
          ],
        }),
      ],
    }),
    informationSection,
    accidentSection,
    ...buildRepeatableSections(),
    //employeeSection,
    //causeAndConsequencesSection,
  ],
})
