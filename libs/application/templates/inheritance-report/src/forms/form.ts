import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { assets } from './sections/assets'
import { debtsAndFuneralCost } from './sections/debtsAndFuneralCost'
import { heirs } from './sections/heirs'
import { applicant } from './sections/applicant'
import { dataCollection } from './sections/dataCollection'
import { deceased } from './sections/deceased'
import { applicationInfo } from './sections/applicationInfo'
import { preSelection } from './sections/applicationTypeSelection'
import { prePaidHeirs } from './sections/prepaidInheritance/heirs'
import { inheritanceExecutor } from './sections/prepaidInheritance/inheritanceExecutor'
import { inheritance } from './sections/prepaidInheritance/inheritance'
import { finalStep } from './sections/finalStep'
import { prePaidApplicant } from './sections/prepaidInheritance/applicant'

export const prepaidInheritanceForm: Form = buildForm({
  id: 'prePaidInheritanceReport',
  mode: FormModes.DRAFT,
  renderLastScreenBackButton: true,
  renderLastScreenButton: true,
  children: [
    prePaidApplicant,
    inheritanceExecutor,
    inheritance,
    assets,
    prePaidHeirs,
    finalStep,
  ],
})

export const estateInheritanceForm: Form = buildForm({
  id: 'inheritanceReport',
  mode: FormModes.DRAFT,
  renderLastScreenBackButton: true,
  renderLastScreenButton: true,
  children: [
    preSelection,
    dataCollection,
    deceased,
    applicationInfo,
    applicant,
    assets,
    debtsAndFuneralCost,
    heirs,
    finalStep,
  ],
})
