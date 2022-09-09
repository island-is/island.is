import {
  buildDescriptionField,
  buildForm,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { m } from '../../lib/messages'
import { announcerInfo } from '../sharedSections/announcerInfo'
import { dataCollection } from '../sharedSections/dataCollection'

export const form: Form = buildForm({
  id: 'estateWithoutProperty',
  title: '',
  mode: FormModes.APPLYING,
  renderLastScreenBackButton: true,
  renderLastScreenButton: true,
  children: [
    dataCollection,
    announcerInfo,
    buildSection({
      id: 'estateMembers',
      title: m.estateMembersTitle,
      children: [
        buildMultiField({
          id: 'estateMembersInfo',
          title: m.estateMembersTitle,
          description: m.estateMembersSubtitle,
          children: [
            buildDescriptionField({
              id: 'estateMembersHeader',
              title: m.estateMembers,
              titleVariant: 'h3',
            }),
          ],
        }),
      ],
    }),
  ],
})
