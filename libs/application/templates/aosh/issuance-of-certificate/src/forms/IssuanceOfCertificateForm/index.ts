import { buildForm } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { applicantSection } from './applicantSection'
import { certificateTypeSection } from './certificateTypeSection'
import { overviewSection } from './overview'
import { Logo } from '../../assets/Logo'

export const IssuanceOfCertificateForm = buildForm({
  id: 'IssuanceOfCertificateForm',
  logo: Logo,
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  children: [applicantSection, certificateTypeSection, overviewSection],
})
