import {
  buildForm,
  buildImageField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { GuitarAndWheelchair } from '@island.is/application/assets/graphics'
import { DirectorateOfEqualityLogo } from '@island.is/application/assets/institution-logos'
import { messages } from '../../lib/messages'

export const NotAllowedForm = buildForm({
  id: 'NotAllowedForm',
  logo: DirectorateOfEqualityLogo,
  children: [
    buildSection({
      id: 'notAllowedSection',
      tabTitle: messages.notAllowed.title,
      children: [
        buildMultiField({
          id: 'notAllowedMultiField',
          title: messages.notAllowed.title,
          description: messages.notAllowed.description,
          children: [
            buildImageField({
              id: 'notAllowedImage',
              image: GuitarAndWheelchair,
              alt: '',
              imageWidth: 'auto',
              imagePosition: 'center',
            }),
          ],
        }),
      ],
    }),
  ],
})
