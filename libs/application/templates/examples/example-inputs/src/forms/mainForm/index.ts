import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { simpleInputsSection } from './simpleInputsSection'
import { compositeFieldsSection } from './compositeFieldsSection'
import { tablesAndRepeatersSection } from './tablesAndRepeatersSection'
import { customSection } from './customSection/customSection'
import { overviewSection } from './overviewSection/overviewSection'
import { introSection } from './introSection/introSection'
import { AoshLogo } from '@island.is/application/assets/institution-logos'

export const MainForm: Form = buildForm({
  id: 'MainForm',
  mode: FormModes.DRAFT,
  logo: AoshLogo,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    introSection,
    simpleInputsSection,
    compositeFieldsSection,
    tablesAndRepeatersSection,
    customSection,
    overviewSection,
  ],
})
