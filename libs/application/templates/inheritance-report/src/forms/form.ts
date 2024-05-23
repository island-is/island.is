import {
  YES,
  buildCheckboxField,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { m } from '../lib/messages'
import { DefaultEvents, Form, FormModes } from '@island.is/application/types'
import { assets } from './sections/assets'
import { debtsAndFuneralCost } from './sections/debtsAndFuneralCost'
import { heirs } from './sections/heirs'
import { applicant } from './sections/applicant'
import { dataCollection } from './sections/dataCollection'
import { deceased } from './sections/deceased'
import { applicationInfo } from './sections/applicationInfo'
import { preSelection } from './sections/applicationTypeSelection'
import { prePaidHeirs } from './sections/prepaidInheritance/heirs'
import { prePaidDataCollection } from './sections/prepaidInheritance/dataCollection'
import { inheritanceExecutor } from './sections/prepaidInheritance/inheritanceExecutor'
import { inheritance } from './sections/prepaidInheritance/inheritance'
import { prepaidOverview } from './sections/prepaidInheritance/overview'
import { finalStep } from './sections/finalStep'

export const prepaidInheritanceForm: Form = buildForm({
  id: 'prePaidInheritanceReport',
  title: '',
  mode: FormModes.DRAFT,
  renderLastScreenBackButton: true,
  renderLastScreenButton: true,
  children: [
    prePaidDataCollection,
    inheritanceExecutor,
    inheritance,
    assets,
    prePaidHeirs,
    prepaidOverview,
  ],
})

export const estateInheritanceForm: Form = buildForm({
  id: 'inheritanceReport',
  title: '',
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
