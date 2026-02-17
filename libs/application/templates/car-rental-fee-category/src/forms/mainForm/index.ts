import { buildForm } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { overviewStatistics } from './overviewStatistics'
import { categorySelection } from './categorySelection'
import { multiUploadSection } from './multiUpload'
import { tableViewSelectionSection } from './tableViewSelection'
import { carsChangesCountSection } from './carsChangesCount'
import { singleOrMultiSelection } from './singleOrMultiSelection'

const applicationChildren = [
  overviewStatistics,
  categorySelection,
  singleOrMultiSelection,
  tableViewSelectionSection,
  multiUploadSection,
  carsChangesCountSection,
]

export const MainForm = buildForm({
  id: 'MainForm',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  children: applicationChildren,
})
