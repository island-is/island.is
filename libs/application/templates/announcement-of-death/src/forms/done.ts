import {
  buildForm,
  buildCustomField,
  buildMultiField,
  buildDescriptionField,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import CoatOfArms from '../assets/CoatOfArms'
import { m } from '../lib/messages'
import {
  additionalInfo,
  extraInfo,
  files,
  inheritance,
  properties,
  testament,
  theAnnouncer,
  theDeceased,
} from './overviewSections'

export const done: Form = buildForm({
  id: 'done',
  title: m.announcementComplete,
  mode: FormModes.IN_PROGRESS,
  logo: CoatOfArms,
  renderLastScreenButton: true,
  children: [
    buildMultiField({
      id: 'done',
      title: m.announcementComplete,
      description: m.announcementCompleteDescription,
      space: 1,
      children: [
        buildCustomField({
          id: 'announcementComplete',
          title: '',
          component: 'Done',
        }),
        buildDescriptionField({
          id: 'nextSteps',
          title: '',
          description: m.nextStepsText,
        }),
        ...theDeceased,
        ...theAnnouncer,
        ...testament,
        ...inheritance,
        ...properties,
        ...files,
        ...extraInfo,
        ...additionalInfo,
      ],
      condition: () => true,
    }),
  ],
})
