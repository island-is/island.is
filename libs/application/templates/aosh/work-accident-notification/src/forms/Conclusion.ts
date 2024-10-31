import { buildForm, buildSection } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import {
  information,
  externalData,
  sections,
  overview,
  conclusion,
} from '../lib/messages'
import { Logo } from '../assets/Logo'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'

export const Conclusion: Form = buildForm({
  id: 'ConclusionApplicationForm',
  title: '',
  logo: Logo,
  mode: FormModes.COMPLETED,
  children: [
    buildSection({
      id: 'externalData',
      title: externalData.dataProvider.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'announcement',
      title: externalData.dataProvider.announcement,
      children: [],
    }),
    buildSection({
      id: 'informationSection',
      title: information.general.pageTitle,
      children: [],
    }),
    buildSection({
      id: 'accidentSection',
      title: sections.draft.accident,
      children: [],
    }),
    buildSection({
      id: `employeeSection`,
      title: sections.draft.employee,
      children: [],
    }),
    buildSection({
      id: `causeAndConsequencesSection`,
      title: sections.draft.causes,
      children: [],
    }),
    buildSection({
      id: `overviewSection`,
      title: overview.general.sectionTitle,
      children: [],
    }),
    buildFormConclusionSection({
      sectionTitle: conclusion.general.sectionTitle,
      multiFieldTitle: conclusion.general.title,
      alertTitle: conclusion.default.alertTitle,
      expandableHeader: conclusion.default.accordionTitle,
      expandableIntro: '',
      expandableDescription: conclusion.default.accordionText,
    }),
  ],
})
