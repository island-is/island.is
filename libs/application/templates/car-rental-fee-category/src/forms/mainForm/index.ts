import { buildForm } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { overviewStatistics } from './overviewStatistics'
import { categorySelection } from './categorySelection'
import { singleOrMultiSelection } from './singleOrMultiSelection'
import { multiUploadSection } from './multiUpload'
import { tableViewSelectionSection } from './tableViewSelection'
import { verifySection } from './verify'
import { endOfMonthCheck } from './endOfMonthCheck'
import { areLessThan7DaysLeftOfMonth } from '../../utils/dayRateUtils'
import { carsChangesCountSection } from './carsChangesCount'

const applicationChildren = [
  overviewStatistics,
  categorySelection,
  singleOrMultiSelection,
  multiUploadSection,
  carsChangesCountSection,
  tableViewSelectionSection,
  verifySection,
]

const tooFewDaysLeftChildren = [endOfMonthCheck]

export const MainForm = buildForm({
  id: 'MainForm',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  children: areLessThan7DaysLeftOfMonth()
    ? tooFewDaysLeftChildren
    : applicationChildren,
})
