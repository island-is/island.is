import {
  buildForm,
  buildCustomField,
  buildMultiField,
  buildDescriptionField,
  buildSection,
  getValueViaPath,
  buildImageField,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { CoatOfArms } from '@island.is/application/assets/institution-logos'
import { m } from '../lib/messages'
import {
  files,
  firearmApplicant,
  inheritance,
  properties,
  testament,
  theAnnouncer,
  theDeceased,
} from './overviewSections'
import AOD from '../assets/AOD'

export const done: Form = buildForm({
  id: 'done',
  title: m.announcementComplete,
  mode: FormModes.IN_PROGRESS,
  logo: CoatOfArms,
  renderLastScreenButton: true,
  children: [
    buildSection({
      id: 'done',
      children: [
        buildMultiField({
          id: 'done',
          title: m.announcementComplete,
          description: m.announcementCompleteDescription,
          space: 1,
          children: [
            buildCustomField({
              id: 'viewOverviewButton',
              component: 'ViewOverviewInDone',
            }),
            buildImageField({
              id: 'viewOverview',
              image: AOD,
              imagePosition: 'center',
              condition: (answers) =>
                getValueViaPath(answers, 'viewOverview') !== true,
            }),
            buildDescriptionField({
              id: 'nextSteps',
              description: m.nextStepsText,
              condition: (answers) =>
                getValueViaPath(answers, 'viewOverview') !== true,
            }),
            ...theDeceased,
            ...theAnnouncer,
            ...testament,
            ...firearmApplicant,
            ...inheritance,
            ...properties,
            ...files,
          ],
        }),
      ],
    }),
  ],
})
