import {
  buildForm,
  buildSection,
  buildSubSection,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'

export const Application: Form = buildForm({
  id: 'RentalAgreementApplication',
  title: 'Rental Agreement Application',
  mode: FormModes.DRAFT,
  children: [
    buildSection({
      id: 'applicantData',
      title: 'Mínar upplýsingar',
      children: [
        buildSubSection({
          id: 'applicantData',
          title: 'Mínar upplýsingar',
          children: [],
        }),
      ],
    }),
  ],
})
