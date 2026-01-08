import { buildForm, buildSection } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import {
  confirmation as confirmationMessages,
  externalData as externalDataMessages,
} from '../../lib/messages'
import { InformationSection } from './InformationSection'

export const MainForm = buildForm({
  id: 'MainForm',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    buildSection({
      id: 'externalData',
      title: externalDataMessages.dataProvider.sectionTitle,
      children: [],
    }),
    InformationSection,
    buildSection({
      id: 'confirmation',
      title: confirmationMessages.sectionTitle,
      children: [],
    }),
  ],
})
