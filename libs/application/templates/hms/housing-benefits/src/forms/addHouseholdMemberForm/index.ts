import { HmsLogo } from '@island.is/application/assets/institution-logos'
import { buildForm } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { addHouseholdMemberSection } from './addHouseholdMemberSection'

export const AddHouseholdMemberForm = buildForm({
  id: 'AddHouseholdMember',
  mode: FormModes.IN_PROGRESS,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  logo: HmsLogo,
  children: [addHouseholdMemberSection],
})
