import { buildForm, buildSection } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { informationSection } from './InformationSection'
import { Logo } from '../../assets/Logo'

import { externalData } from '../../lib/messages/externalData'
import { accidentSection } from './AccidentSection'

export const WorkAccidentNotificationForm: Form = buildForm({
  id: 'WorkAccidentNotificationFormsDraft',
  title: '',
  logo: Logo,
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    buildSection({
      id: 'externalData',
      title: externalData.dataProvider.sectionTitle,
      children: [],
    }),
    informationSection,
    accidentSection,
  ],
})
