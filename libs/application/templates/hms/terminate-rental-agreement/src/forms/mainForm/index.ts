import { buildForm } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { overviewSection } from './overviewSection'
import { terminationTypeSection } from './terminationType'
import { chooseContractSection } from './chooseContractSection'
import { unboundTerminationSection } from './unboundTerminationSection'
import { boundTerminationSection } from './boundTerminationSection'
import { cancelationSection } from './cancelationSection'
import { cancelWarningSection } from './cancelWarningSection'
import { boundTerminationWarningSection } from './boundTerminationWarningSection'
import { HmsLogo } from '@island.is/application/assets/institution-logos'
import { personalInformationSection } from './personalInformationSection'
import { fileUploadSection } from './fileUploadSection'

export const MainForm = buildForm({
  id: 'MainForm',
  logo: HmsLogo,
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    personalInformationSection,
    chooseContractSection,
    terminationTypeSection,
    cancelWarningSection,
    boundTerminationWarningSection,
    cancelationSection,
    unboundTerminationSection,
    boundTerminationSection,
    fileUploadSection,
    overviewSection,
  ],
})
