import { buildForm, buildSection } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { confirmation } from '../../lib/messages'
import { informationSection } from './informationSection'
import { prerequisitesSection } from './prerequisitesSection'
import { TransportAuthorityLogo } from '@island.is/application/assets/institution-logos'

export const DrivingLicenseBookUpdateInstructorForm: Form = buildForm({
  id: 'DrivingLicenseBookUpdateInstructorFormDraft',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  logo: TransportAuthorityLogo,
  children: [
    prerequisitesSection,
    informationSection,
    buildSection({
      id: 'confirmation',
      title: confirmation.general.sectionTitle,
      children: [],
    }),
  ],
})
