import { buildForm, buildSection } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { prerequisitesMessages, sharedMessages } from '../../lib/messages'
import { childrenSubSection } from './childrenSubSection'
import { externalDataSubSection } from './externalDataSubSection'

export const Prerequisites: Form = buildForm({
  id: 'newPrimarySchoolPrerequisites',
  title: sharedMessages.formTitle,
  mode: FormModes.NOT_STARTED,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    buildSection({
      id: 'prerequisites',
      title: prerequisitesMessages.shared.sectionTitle,
      children: [externalDataSubSection, childrenSubSection],
    }),
  ],
})
