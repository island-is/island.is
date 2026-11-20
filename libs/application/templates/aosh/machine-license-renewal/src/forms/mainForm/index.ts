import { buildForm } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { AoshLogo } from '@island.is/application/assets/institution-logos'
import { buildFormPaymentChargeOverviewSection } from '@island.is/application/ui-forms'
import { payment } from '../../lib/messages'
import { getChargeItems } from '../../utils/getChargeItems'
import { conclusionSection } from '../conclusionSection'
import { applicantSection } from './applicantSection'
import { rightsSection } from './rightsSection'
import { medicalCertificateSection } from './medicalCertificateSection'
import { licenseSection } from './licenseSection'
import { overviewSection } from './overviewSection'

export const MainForm = buildForm({
  id: 'MainForm',
  logo: AoshLogo,
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    applicantSection,
    rightsSection,
    medicalCertificateSection,
    licenseSection,
    overviewSection,
    buildFormPaymentChargeOverviewSection({
      sectionTitle: payment.general.sectionTitle,
      getSelectedChargeItems: () =>
        getChargeItems().map((item) => ({
          chargeItemCode: item.code,
          chargeItemQuantity: item.quantity,
        })),
    }),
    conclusionSection,
  ],
})
