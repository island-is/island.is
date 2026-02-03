import { buildForm } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { overviewStatistics } from './overviewStatistics'
import { categorySelection } from './categorySelection'
import { multiUploadSection } from './multiUpload'
import { tableViewSelectionSection } from './tableViewSelection'
import { verifySection } from './verify'
import { carsChangesCountSection } from './carsChangesCount'

const applicationChildren = [
  overviewStatistics,
  categorySelection,
  multiUploadSection,
  carsChangesCountSection,
  tableViewSelectionSection,
  verifySection,
]

export const MainForm = buildForm({
  id: 'MainForm',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  children: applicationChildren,
})
