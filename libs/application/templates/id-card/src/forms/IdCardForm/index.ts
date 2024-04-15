import { buildForm, buildSection } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { externalData } from '../../lib/messages'
import { IdInformationSection } from './IdInformation'
import { ApplicanInformationSubSection } from './Information'
import { PriceListSubSection } from './PriceList'
// import { Logo } from '../../assets/Logo'

export const IdCardForm: Form = buildForm({
  id: 'UniversityFormDraft',
  title: '',
  // logo: Logo,
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    buildSection({
      id: 'externalData',
      title: externalData.dataProvider.sectionTitle,
      children: [],
    }),
    IdInformationSection,
    ApplicanInformationSubSection,
    PriceListSubSection,
  ],
})
