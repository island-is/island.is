import { buildForm } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { overviewStatistics } from './overviewStatistics'
import { categorySelection } from './categorySelection'
import { overviewSection } from './overview'
import { singleOrMultiSelection } from './singleOrMultiSelection'
import { multiUploadSection } from './multiUpload'
import { tableViewSelectionSection } from './tableViewSelection'
import { verifySection } from './verify'

export const MainForm = buildForm({
  id: 'MainForm',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  children: [
    overviewStatistics, 
    categorySelection,
    singleOrMultiSelection,
    multiUploadSection,
    tableViewSelectionSection,
    verifySection,
    overviewSection
  ],
})
