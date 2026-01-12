import { buildForm, buildSection } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { confirmation, payment } from '../../lib/messages'
import { cardTypeSection } from './cardTypeSection'
import { applicantSection } from './applicantSection'
import { externalDataSection } from './externalDataSection'
import { fakeDataSection } from './fakeDataSection'
import { TransportAuthorityLogo } from '@island.is/application/assets/institution-logos'
import { buildFormPaymentChargeOverviewSection } from '@island.is/application/ui-forms'
import { getChargeItems } from '../../utils'

export const getDigitalTachographDriversCardForm = ({
  allowFakeData = false,
}): Form =>
  buildForm({
    id: 'DigitalTachographDriversCardFormDraft',
    logo: TransportAuthorityLogo,
    mode: FormModes.DRAFT,
    renderLastScreenButton: true,
    renderLastScreenBackButton: true,
    children: [
      ...(allowFakeData ? [fakeDataSection] : []),
      externalDataSection,
      cardTypeSection,
      applicantSection,
      buildFormPaymentChargeOverviewSection({
        sectionTitle: payment.general.sectionTitle,
        getSelectedChargeItems: (application) =>
          getChargeItems(application).map((item) => ({
            chargeItemCode: item.code,
            chargeItemQuantity: item.quantity,
          })),
      }),
      buildSection({
        id: 'confirmation',
        title: confirmation.general.sectionTitle,
        children: [],
      }),
    ],
  })
