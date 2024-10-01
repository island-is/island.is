import { buildForm, buildSection } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { externalData, payment } from '../../lib/messages'
import { IdInformationSection } from './IdInformation'
import { ApplicanInformationSubSection } from './ApplicantInformation'
import { PriceListSubSection } from './PriceList'
import { OverviewSection } from '../Review/Overview'
import { buildFormPaymentChargeOverviewSection } from '@island.is/application/ui-forms'
import { getChargeItemCodes } from '../../utils'
// import { Logo } from '../../assets/Logo'

export const IdCardForm: Form = buildForm({
  id: 'IdCardFormDraft',
  title: '',
  // logo: Logo,
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    buildSection({
      id: 'externalData',
      title: externalData.dataProvider.sectionTitle,
      children: [],
    }),
    IdInformationSection,
    ApplicanInformationSubSection,
    PriceListSubSection,
    OverviewSection,
    buildFormPaymentChargeOverviewSection({
      sectionTitle: payment.general.sectionTitle,
      getSelectedChargeItems: (application) =>
        getChargeItemCodes(application).map((x) => ({
          chargeItemCode: x,
        })),
    }),
  ],
})
