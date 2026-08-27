import {
  buildDescriptionField,
  buildForm,
  buildImageField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { HmsLogo } from '@island.is/application/assets/institution-logos'
import * as m from '../../lib/messages'
import { HandShake } from '@island.is/application/assets/graphics'

export const TaxReturnRequiredForm = buildForm({
  id: 'TaxReturnRequiredForm',
  mode: FormModes.DRAFT,
  logo: HmsLogo,
  renderLastScreenButton: true,
  children: [
    buildSection({
      id: 'taxReturnRequired',
      tabTitle: m.taxReturnRequiredMessages.title,
      children: [
        buildMultiField({
          id: 'taxReturnRequiredMultiField',
          title: m.taxReturnRequiredMessages.multiFieldTitle,
          children: [
            buildDescriptionField({
              id: 'taxReturnRequiredDescription',
              description: m.taxReturnRequiredMessages.description,
              marginBottom: 4,
            }),
            buildDescriptionField({
              id: 'taxReturnRequiredDescription2',
              description: m.taxReturnRequiredMessages.description2,
              marginBottom: 10,
            }),
            buildImageField({
              id: 'taxReturnRequiredImage',
              image: HandShake,
            }),
          ],
        }),
      ],
    }),
  ],
})
