import {
  buildForm,
  buildSection,
  buildExternalDataProvider,
  buildDataProviderItem,
  buildCustomField,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { m } from '../lib/messages'
import { NoDebtCertificateApi } from '../dataProviders'

export const NoDebtCertificateForm: Form = buildForm({
  id: 'NoDebtCertificateFormDraft',
  title: '',
  mode: FormModes.DRAFT,
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
              provider: NoDebtCertificateApi,
              title: m.noDebtCertificateInformationTitle,
              subTitle: m.noDebtCertificateInformationSubTitle,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'confirmation',
      title: m.confirmation,
      children: [
        buildCustomField({
          component: 'ConfirmationPendingField',
          id: 'confirmationPendingField',
          title: '',
          description: '',
        }),
      ],
    }),
  ],
})
