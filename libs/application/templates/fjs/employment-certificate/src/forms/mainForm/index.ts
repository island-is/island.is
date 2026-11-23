import { buildForm } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { FjarsyslaRikisinsLogo } from '@island.is/application/assets/institution-logos'
import { conclusionStubSection, externalDataStubSection } from '../stubSections'
import { personalInformationSection } from './personalInformationSection'
import { employmentHistorySection } from './employmentHistorySection'

export const MainForm = buildForm({
  id: 'MainForm',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  logo: FjarsyslaRikisinsLogo,
  children: [
    externalDataStubSection,
    personalInformationSection,
    employmentHistorySection,
    conclusionStubSection,
  ],
})
