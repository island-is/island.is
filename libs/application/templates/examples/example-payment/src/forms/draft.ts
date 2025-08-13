import {
  buildExternalDataProvider,
  buildDataProviderItem,
  buildMultiField,
  buildRadioField,
  buildSubmitField,
  buildForm,
  buildSection,
} from '@island.is/application/core'
import {
  DefaultEvents,
  Form,
  FormModes,
  PaymentCatalogApi,
} from '@island.is/application/types'
import * as m from '../lib/messages'
import { chargeItemCodeRadioOptions } from '../lib/utils/chargeItemCodeRadioOptions'
import { MockPaymentCatalogWithTwoItems } from '../dataProviders'

export const draft: Form = buildForm({
  id: 'ExamplePaymentDraftForm',
  title: m.m.applicationTitle,
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    buildSection({
      id: 'externalData',
      title: m.step.externalDataTitle,
      children: [
        buildExternalDataProvider({
          title: m.draft.externalDataTitle,
          id: 'approveExternalData',
          subTitle: m.draft.externalDataTitle,
          checkboxLabel: m.draft.externalDataTitle,
          dataProviders: [
            buildDataProviderItem({
              provider: PaymentCatalogApi,
            }),
            buildDataProviderItem({
              provider: MockPaymentCatalogWithTwoItems,
              title: m.draft.feeInfo,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'info',
      title: m.step.info,
      children: [
        buildMultiField({
          id: 'info',
          title: m.draft.informationTitle,
          space: 1,
          children: [
            buildSubmitField({
              id: 'submit',
              placement: 'footer',
              title: m.m.payUp,
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  event: DefaultEvents.PAYMENT,
                  name: m.m.payUp,
                  type: 'primary',
                },
              ],
            }),
            buildRadioField({
              id: 'userSelectedChargeItemCode',
              title: m.draft.selectFieldTitle,
              options: chargeItemCodeRadioOptions,
            }),
          ],
        }),
      ],
    }),
  ],
})
