import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { userInformationSection } from './userInformationSection'
import { schoolSection } from './schoolSection'
import { extraInformationSection } from './extraInformationSection'
import { overviewSection } from './overviewSection'
import { MmsLogo } from '@island.is/application/assets/institution-logos'
import { conclusionSection } from './conclusionSection'

export const SecondarySchoolForm: Form = buildForm({
  id: 'SecondarySchoolForm',
  logo: MmsLogo,
  mode: FormModes.DRAFT,
  renderLastScreenButton: false,
  renderLastScreenBackButton: true,
  children: [
    userInformationSection,
    schoolSection,
    extraInformationSection,
    overviewSection,
    // Note: The conclusion section will appear after submit, but then on refresh the
    // conclusionForm is visible (overview)
    conclusionSection,
  ],
})
