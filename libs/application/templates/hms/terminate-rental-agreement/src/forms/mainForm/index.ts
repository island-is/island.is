import { buildForm } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { overviewSection } from './overview'
import { terminationTypeSection } from './terminationType'
import { chooseContractSection } from './chooseContractSection'
import { unboundTerminationSection } from './unboundTerminationSection'
import { boundTerminationSection } from './boundTerminationSection'
import { cancelationSection } from './cancelationSection'
export const MainForm = buildForm({
  id: 'MainForm',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  children: [
    chooseContractSection,
    terminationTypeSection,
    cancelationSection,
    unboundTerminationSection,
    boundTerminationSection,
    overviewSection,
  ],
})
