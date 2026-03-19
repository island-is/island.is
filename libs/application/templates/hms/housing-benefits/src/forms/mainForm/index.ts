import { buildForm } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { personalInformationSection } from './personalInformationSection'
import { overviewSection } from './overviewSection'
import { HmsLogo } from '@island.is/application/assets/institution-logos'
import { rentalAgreementSection } from './rentalAgreementSection'
import { householdMembersSection } from './householdMembersSection'
import { exemptionSection } from './exemptionSection'
import { paymentSection } from './paymentSection'
import { incomeSection } from './incomeSection'

export const MainForm = buildForm({
  id: 'MainForm',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  logo: HmsLogo,
  children: [
    personalInformationSection,
    rentalAgreementSection,
    exemptionSection,
    householdMembersSection,
    incomeSection,
    paymentSection,
    overviewSection,
  ],
})
