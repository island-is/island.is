import {
  buildCustomField,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubmitField,
  getValueViaPath,
} from '@island.is/application/core'
import { DefaultEvents, Form, FormModes } from '@island.is/application/types'
import { Routes } from '../lib/constants'
import {
  attachments,
  general,
  advert,
  original,
  requirements,
  preview,
  publishing,
  summary,
  involvedParty,
  typeSelection,
} from '../lib/messages'
import { InputFields } from '../lib/types'

const isMinistry = (answers: Record<string, unknown>) => {
  const title = getValueViaPath<string>(
    answers,
    InputFields.advert.involvedPartyTitle,
  )
  return !!title && title.toLowerCase().includes('ráðuneyti')
}

const isNotMinistry = (answers: Record<string, unknown>) => !isMinistry(answers)

const buildSubmitToDraftField = (id: string, condition?: typeof isMinistry) =>
  buildSubmitField({
    id,
    condition,
    refetchApplicationAfterSubmit: true,
    actions: [
      {
        event: DefaultEvents.SUBMIT,
        name: general.continue,
        type: 'primary',
      },
    ],
  })

export const Requirements: Form = buildForm({
  id: 'OfficialJournalOfIcelandApplication',
  title: general.applicationName,
  mode: FormModes.DRAFT,
  children: [
    buildSection({
      id: Routes.REQUIREMENTS,
      title: requirements.general.section,
      children: [
        buildMultiField({
          id: Routes.REQUIREMENTS,
          children: [
            buildCustomField({
              id: 'requirements',
              component: 'RequirementsScreen',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: Routes.INVOLVED_PARTY,
      title: involvedParty.general.section,
      children: [
        buildMultiField({
          id: Routes.INVOLVED_PARTY,
          children: [
            buildCustomField({
              id: 'involvedParty',
              component: 'InvolvedPartyScreen',
            }),
            buildSubmitToDraftField('toDraft', isNotMinistry),
          ],
        }),
        buildMultiField({
          id: '',
          children: [],
        }),
      ],
    }),
    buildSection({
      id: Routes.TYPE_SELECTION,
      title: typeSelection.general.section,
      condition: isMinistry,
      children: [
        buildMultiField({
          id: Routes.TYPE_SELECTION,
          children: [
            buildCustomField({
              id: 'typeSelection',
              component: 'TypeSelectionScreen',
            }),
            buildSubmitToDraftField('toDraftFromTypeSelection'),
          ],
        }),
        buildMultiField({
          id: '',
          children: [],
        }),
      ],
    }),
    buildSection({
      id: Routes.ADVERT,
      title: advert.general.section,
      children: [],
    }),
    buildSection({
      id: Routes.ATTACHMENTS,
      title: attachments.general.section,
      children: [],
    }),
    buildSection({
      id: Routes.PREVIEW,
      title: preview.general.section,
      children: [],
    }),
    buildSection({
      id: Routes.ORIGINAL,
      title: original.general.section,
      children: [],
    }),
    buildSection({
      id: Routes.PUBLISHING,
      title: publishing.general.section,
      children: [],
    }),
    buildSection({
      id: Routes.SUMMARY,
      title: summary.general.section,
      children: [],
    }),
  ],
})
