import {
  buildForm,
  buildSection,
  buildExternalDataProvider,
  buildDataProviderItem,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { m } from '../lib/messages'
import {
  SyslumadurPaymentCatalogApi,
  CriminalRecordApi,
  MockableSyslumadurPaymentCatalogApi,
} from '../dataProviders'
import { buildFormPaymentChargeOverviewSection } from '@island.is/application/ui-forms'
import { getChargeItems } from '../utils'

export const CriminalRecordForm: Form = buildForm({
  id: 'CriminalRecordFormDraft',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  children: [
    buildSection({
      id: 'externalData',
      title: m.externalDataSection,
      children: [
        buildExternalDataProvider({
          title: m.externalDataTitle,
          id: 'approveExternalData',
          subTitle: m.externalDataSubTitle,
          checkboxLabel: m.externalDataAgreement,
          dataProviders: [
            buildDataProviderItem({
              provider: CriminalRecordApi,
              title: m.criminalRecordInformationTitle,
              subTitle: m.criminalRecordInformationSubTitle,
            }),
            buildDataProviderItem({
              provider: SyslumadurPaymentCatalogApi,
            }),
            buildDataProviderItem({
              provider: MockableSyslumadurPaymentCatalogApi,
            }),
          ],
        }),
      ],
    }),
    buildFormPaymentChargeOverviewSection({
      sectionTitle: m.payment,
      getSelectedChargeItems: (_) =>
        getChargeItems().map((item) => ({
          chargeItemCode: item.code,
          chargeItemQuantity: item.quantity,
        })),
    }),
    buildSection({
      id: 'confirmation',
      title: m.confirmation,
      children: [],
    }),
  ],
})
