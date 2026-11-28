import { IcelandHealthLogo } from '@island.is/application/assets/institution-logos'
import { buildForm } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { childrenSection } from './childrenSection'
import { externalDataSection } from './externalDataSection'

export const Prerequisites = buildForm({
  id: 'Prerequisites',
  mode: FormModes.NOT_STARTED,
  logo: IcelandHealthLogo,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [externalDataSection, childrenSection],
})
