import { buildForm } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { aboutTheCompanySection } from './aboutTheCompanySection'
import { skyrslaSection } from './skyrslaSection'
import { launagreiningSection } from './launagreiningSection'
import { overviewSection } from './overviewSection'

export const MainForm = buildForm({
  id: 'MainForm',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  children: [
    aboutTheCompanySection,
    skyrslaSection,
    launagreiningSection,
    overviewSection,
  ],
})
