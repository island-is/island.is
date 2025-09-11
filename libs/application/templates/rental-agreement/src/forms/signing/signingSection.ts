import {
  buildAlertMessageField,
  buildDescriptionField,
  buildImageField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { Section } from '@island.is/application/types'
import * as m from '../../lib/messages'

import RA from '../../assets/RA'

export const SigningSection: Section = buildSection({
  id: 'SigningSection',
  title: m.signing.sectionName,
  children: [
    buildMultiField({
      id: 'signing.info',
      title: m.signing.pageTitle,
      children: [
        buildAlertMessageField({
          id: 'signing.alert',
          alertType: 'success',
          title: m.signing.alertMessageSuccess,
          marginTop: 0,
          marginBottom: 6,
        }),
        buildDescriptionField({
          id: 'signing.description',
          title: m.signing.pageInfoTitle,
          titleVariant: 'h3',
          description: m.signing.pageInfoDescription,
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
