import { buildForm } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { HmsLogo } from '@island.is/application/assets/institution-logos'
import { personalInformationSection } from './personalInformationSection'
import { wrongHomeSection } from './wrongHomeSection'
import { refetchNationalRegistrySection } from './refetchNationalRegistrySection'

export const AssigneeDraftForm = buildForm({
  id: 'AssigneeApproval',
  mode: FormModes.IN_PROGRESS,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  logo: HmsLogo,
  children: [
    personalInformationSection,
    wrongHomeSection,
    refetchNationalRegistrySection,
  ],
})
