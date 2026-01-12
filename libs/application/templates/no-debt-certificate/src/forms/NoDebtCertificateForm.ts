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
import { DistrictCommissionersLogo } from '@island.is/application/assets/institution-logos'

export const NoDebtCertificateForm: Form = buildForm({
  id: 'NoDebtCertificateFormDraft',
  mode: FormModes.DRAFT,
  logo: DistrictCommissionersLogo,
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
          description: '',
        }),
      ],
    }),
  ],
})
