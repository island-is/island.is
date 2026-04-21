import { buildForm } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { overviewStatistics } from './overviewStatistics'
import { singleOrMultiSelection } from './singleOrMultiSelection'
import { tableViewSelectionSection } from './tableViewSelection'
import { multiUploadSection } from './multiUpload'
import { carsChangesCountSection } from './carsChangesCount'

const applicationChildren = [
  overviewStatistics,
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
