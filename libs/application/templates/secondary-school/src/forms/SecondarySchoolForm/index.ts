import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { userInformationSection } from './UserInformationSection'
import { Logo } from '../../assets/Logo'
import { schoolSection } from './SchoolSection'
import { extraInformationSection } from './ExtraInformationSection'
import { overviewSection } from './OverviewSection'

export const SecondarySchoolForm: Form = buildForm({
  id: 'SecondarySchoolFormDraft',
  title: '',
  logo: Logo,
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    userInformationSection,
    schoolSection,
    extraInformationSection,
    overviewSection,
  ],
})
