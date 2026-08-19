import { buildForm, buildSection } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { prerequisitesMessages } from '../../lib/messages'
import { childSubSection } from './childSubSection'
import {
  externalDataSubSection,
  personalExternalDataSubSection,
} from './externalDataSubSection'
import { serviceProviderSubSection } from './serviceProviderSubSection'

export const PersonalPrerequisites = buildForm({
  id: 'prerequisites',
  mode: FormModes.NOT_STARTED,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    buildSection({
      id: 'prerequisites',
      title: prerequisitesMessages.shared.sectionTitle,
      children: [personalExternalDataSubSection],
    }),
  ],
})

export const Prerequisites = buildForm({
  id: 'prerequisites',
  mode: FormModes.NOT_STARTED,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    buildSection({
      id: 'prerequisites',
      title: prerequisitesMessages.shared.sectionTitle,
      children: [
        externalDataSubSection,
        serviceProviderSubSection,
        childSubSection,
      ],
    }),
  ],
})
