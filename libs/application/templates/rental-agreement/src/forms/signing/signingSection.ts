import {
  buildAlertMessageField,
  buildDescriptionField,
  buildImageField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { Section } from '@island.is/application/types'
import { signing } from '../../lib/messages/signing'

import RA from '../../assets/RA'

export const SigningSection: Section = buildSection({
  id: 'SigningSection',
  title: signing.sectionName,
  children: [
    buildMultiField({
      id: 'signing.info',
      title: signing.pageTitle,
      children: [
        buildAlertMessageField({
          id: 'signing.alert',
          alertType: 'success',
          title: signing.alertMessageSuccess,
          marginTop: 0,
          marginBottom: 6,
        }),
        buildDescriptionField({
          id: 'signing.description',
          title: signing.pageInfoTitle,
          titleVariant: 'h3',
          description: signing.pageInfoDescription,
          marginBottom: 8,
        }),
        buildImageField({
          id: 'signing.image',
          width: 'full',
          image: RA,
          imagePosition: 'center',
          alt: 'Undirritun',
        }),
      ],
    }),
  ],
})
