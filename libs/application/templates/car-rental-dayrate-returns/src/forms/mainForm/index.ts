import { buildForm } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { overviewStatistics } from './overviewStatistics'
import { multiUploadSection } from './multiUpload'
import { verifySection } from './verify'
import { carsChangesCountSection } from './carsChangesCount'

const applicationChildren = [
  overviewStatistics,
  multiUploadSection,
  carsChangesCountSection,
  verifySection,
]

export const MainForm = buildForm({
  id: 'MainForm',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  children: applicationChildren,
})
