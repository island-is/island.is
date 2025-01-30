import { buildForm, buildSection } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { newPrimarySchoolMessages } from '../../lib/messages'
import { applicationTypeSubSection } from './applicationTypeSubSection'
import { childrenSubSection } from './childrenSubSection'
import { externalDataSubSection } from './externalDataSubSection'

export const Prerequisites: Form = buildForm({
  id: 'newPrimarySchoolPrerequisites',
  title: newPrimarySchoolMessages.shared.formTitle,
  mode: FormModes.NOT_STARTED,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    buildSection({
      id: 'prerequisites',
      title: newPrimarySchoolMessages.pre.externalDataSection,
      children: [
        applicationTypeSubSection,
        externalDataSubSection,
        childrenSubSection,
      ],
    }),
  ],
})
