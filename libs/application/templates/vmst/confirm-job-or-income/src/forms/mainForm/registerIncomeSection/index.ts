import { buildSection } from '@island.is/application/core'
import * as m from '../../../lib/messages'
import { casualWorkSection } from './casualWorkSection'
import { partTimeSection } from './partTimeSection'
import { contractWorkSection } from './contractWorkSection'
import { pensionSection } from './pensionSection'
import { capitalIncomeSection } from './capitalIncomeSection'
import { socialInsuranceSection } from './socialInsuranceSection'

export const registerIncomeSection = buildSection({
  id: 'registerIncomeSection',
  title: m.application.incomeSectionTitle,
  children: [
    casualWorkSection,
    partTimeSection,
    contractWorkSection,
    pensionSection,
    capitalIncomeSection,
    socialInsuranceSection,
  ],
})
