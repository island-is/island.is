import { buildForm, buildSection } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import {
  userInformation,
  externalData,
  conclusion,
  school,
  extraInformation,
  overview,
} from '../lib/messages'
import { Logo } from '../assets/Logo'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'

export const Conclusion: Form = buildForm({
  id: 'ConclusionForm',
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
      id: 'userInformationSection',
      title: userInformation.general.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'schoolSection',
      title: school.general.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'extraInformationSection',
      title: extraInformation.general.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'overviewSection',
      title: overview.general.sectionTitle,
      children: [],
    }),
    buildFormConclusionSection({
      alertTitle: conclusion.general.alertTitle,
      alertMessage: conclusion.general.alertMessage,
      expandableHeader: conclusion.general.accordionTitle,
      expandableDescription: conclusion.general.accordionText,
    }),
  ],
})
