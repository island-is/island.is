import { buildForm } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { HmsLogo } from '@island.is/application/assets/institution-logos'
import { personalInformationSection } from './personalInformationSection'
import { wrongHomeSection } from './wrongHomeSection'
import { refetchNationalRegistrySection } from './refetchNationalRegistrySection'
import { accessAgreementSection } from './accessAgreementSection'
import { assetDeclerationSection } from './assetDeclerationSection'
import { assigneeOverviewSection } from './assigneeOverviewSection'
import { incomeDeclarationSection } from './incomeDeclarationSection'

export const AssigneeDraftForm = buildForm({
  id: 'AssigneeApproval',
  mode: FormModes.IN_PROGRESS,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  logo: HmsLogo,
  children: [
    wrongHomeSection,
    refetchNationalRegistrySection,
    personalInformationSection,
    accessAgreementSection,
    assetDeclerationSection,
    incomeDeclarationSection,
    assigneeOverviewSection,
  ],
})
