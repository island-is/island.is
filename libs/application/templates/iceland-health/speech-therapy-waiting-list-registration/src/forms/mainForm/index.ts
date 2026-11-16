import { IcelandHealthLogo } from '@island.is/application/assets/institution-logos'
import { buildForm } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { childSection } from './childSection'
import { guardiansSection } from './guardiansSection'
import { otherInformationSection } from './otherInformationSection'
import { overviewSection } from './overviewSection'

export const MainForm = buildForm({
  id: 'MainForm',
  mode: FormModes.DRAFT,
  logo: IcelandHealthLogo,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    childSection,
    guardiansSection,
    otherInformationSection,
    overviewSection,
  ],
})
