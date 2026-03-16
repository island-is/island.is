import { buildForm, buildMultiField } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import {
  buildDescriptionField,
  buildSection,
} from '@island.is/application/core'
import { HmsLogo } from '@island.is/application/assets/institution-logos'
import * as m from '../../lib/messages'

export const NoRentalAgreementForm = buildForm({
  id: 'NoRentalAgreementForm',
  mode: FormModes.DRAFT,
  logo: HmsLogo,
  children: [
    buildSection({
      id: 'noRentalAgreement',
      tabTitle: m.noRentalAgreementMessages.title,
      children: [
        buildMultiField({
          id: 'noRentalAgreementMultiField',
          title: m.noRentalAgreementMessages.multiFieldTitle,
          children: [
            buildDescriptionField({
              id: 'noRentalAgreementDescription',
              description: m.noRentalAgreementMessages.description,
              marginBottom: 4,
            }),
            buildDescriptionField({
              id: 'noRentalAgreementDescription2',
              description: m.noRentalAgreementMessages.description2,
            }),
          ],
        }),
      ],
    }),
  ],
})
