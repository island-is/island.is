import { FormBuilder } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { simpleInputsSection } from './simpleInputsSection'
import { compositeFieldsSection } from './compositeFieldsSection'
import { tablesAndRepeatersSection } from './tablesAndRepeatersSection'
import { customSection } from './customSection/customSection'
import { overviewSection } from './overviewSection/overviewSection'
import { introSection } from './introSection/introSection'
import { CoatOfArms } from '@island.is/application/assets/institution-logos'

export const MainForm: Form = {
  ...new FormBuilder('MainForm', '', {
    mode: FormModes.DRAFT,
    logo: CoatOfArms,
    renderLastScreenButton: true,
    renderLastScreenBackButton: true,
  }).build(),
  children: [
    introSection,
    simpleInputsSection,
    compositeFieldsSection,
    tablesAndRepeatersSection,
    customSection,
    overviewSection,
  ],
}
