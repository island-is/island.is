import {
  buildForm,
  buildImageField,
  buildMultiField,
} from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import {
  buildDescriptionField,
  buildSection,
} from '@island.is/application/core'
import { HmsLogo } from '@island.is/application/assets/institution-logos'
import { HandShake } from '@island.is/application/assets/graphics'
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
              id: 'noRentalAgreementDescriptionMarkdown',
              description: m.noRentalAgreementMessages.descriptionMarkdown,
              marginBottom: 4,
            }),
            buildDescriptionField({
              id: 'noRentalAgreementDescription2',
              description: m.noRentalAgreementMessages.description2,
              marginBottom: 8,
            }),
            buildImageField({
              id: 'noRentalAgreementImage',
              image: HandShake,
              marginBottom: 10,
            }),
          ],
        }),
      ],
    }),
  ],
})
