import {
  ChildrenCustodyInformationApi,
  NationalRegistrySpouseApi,
  NationalRegistryUserApi,
} from '@island.is/application/types'
import { Form, FormModes } from '@island.is/application/types'
import {
  buildCustomField,
  buildDataProviderItem,
  buildExternalDataProvider,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubmitField,
  buildTextField,
} from '@island.is/application/core'

import { EhicCardResponseApi } from '../dataProviders'
import { europeanHealthInsuranceCardApplicationMessages as e } from '../lib/messages'

export const EuropeanHealthInsuranceReviewCard: Form = buildForm({
  id: 'EuropeanHealthInsuranceReviewCard',
  title: '',
  mode: FormModes.APPROVED,
  children: [
    buildSection({
      id: 'applicant',
      title: 'Staðfesting',
      children: [
        buildTextField({
          id: 'applicant.email',
          title: 'temp label',
          variant: 'email',
          backgroundColor: 'blue',
          required: true,
          defaultValue: '',
        }),
      ],
    }),
  ],
})
export default EuropeanHealthInsuranceReviewCard
