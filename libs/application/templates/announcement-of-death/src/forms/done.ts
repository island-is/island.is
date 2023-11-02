import {
  buildForm,
  buildCustomField,
  buildMultiField,
  buildDescriptionField,
  buildSection,
  getValueViaPath,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import CoatOfArms from '../assets/CoatOfArms'
import { m } from '../lib/messages'
import {
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
    buildSection({
      id: 'done',
      title: '',
      children: [
        buildMultiField({
          id: 'done',
          title: m.announcementComplete,
          description: m.announcementCompleteDescription,
          space: 1,
          children: [
            buildCustomField({
              id: 'viewOverviewButton',
              title: '',
              component: 'ViewOverviewInDone',
            }),
            buildCustomField({
              id: 'viewOverview',
              title: '',
              component: 'Done',
              condition: (answers) =>
                getValueViaPath(answers, 'viewOverview') !== true,
            }),
            buildDescriptionField({
              id: 'nextSteps',
              title: '',
              description: m.nextStepsText,
              condition: (answers) =>
                getValueViaPath(answers, 'viewOverview') !== true,
            }),
            ...theDeceased,
            ...theAnnouncer,
            ...testament,
            ...inheritance,
            ...properties,
            ...files,
            ...extraInfo,
          ],
        }),
      ],
    }),
  ],
})
