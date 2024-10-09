import { buildSection } from '@island.is/application/core'
import * as m from '../../../lib/messages'
import { incomeSubSection } from './incomeSubSection'
import { incomeFilesSubSection } from './incomeFileSubSection'
import { taxReturnFilesSubSection } from './taxReturnFilesSubSection'
import { personalTaxCreditSubSection } from './personalTaxCreditSubSection'
import { bankInfoSubSection } from './bankInfoSubSection'
import { Routes } from '../../../lib/constants'

export const financesSection = buildSection({
  id: Routes.FINANCES,
  title: m.section.finances,
  children: [
    incomeSubSection,
    incomeFilesSubSection,
    taxReturnFilesSubSection,
    personalTaxCreditSubSection,
    bankInfoSubSection,
  ],
})
