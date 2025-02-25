import { buildForm, buildSection } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { information, externalData, conclusion } from '../lib/messages'
import { Logo } from '../assets/Logo'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'

export const Conclusion: Form = buildForm({
  id: 'ConclusionApplicationForm',
  logo: Logo,
  mode: FormModes.COMPLETED,
  children: [
    buildSection({
      id: 'externalData',
      title: externalData.dataProvider.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'informationSection',
      title: information.general.sectionTitle,
      children: [],
    }),
    buildFormConclusionSection({
      sectionTitle: conclusion.general.sectionTitle,
      multiFieldTitle: conclusion.general.title,
      alertTitle: conclusion.default.alertTitle,
      expandableHeader: conclusion.default.accordionTitle,
      expandableDescription: conclusion.default.accordionText,
    }),
  ],
})
