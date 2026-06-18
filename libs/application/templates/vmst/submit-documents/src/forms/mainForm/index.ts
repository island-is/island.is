import { buildForm } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { uploadDocumentsSection } from './uploadDocuments'
import { DirectorateOfLabourLogo } from '@island.is/application/assets/institution-logos'

export const MainForm = buildForm({
  id: 'MainForm',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  logo: DirectorateOfLabourLogo,
  children: [uploadDocumentsSection],
})
