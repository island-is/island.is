import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { userInformationSection } from './userInformationSection'
import { schoolSection } from './schoolSection'
import { extraInformationSection } from './extraInformationSection'
import { overviewSection } from './overviewSection'
import { Logo } from '../../assets/Logo'

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
