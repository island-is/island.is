import {
  buildAlertMessageField,
  buildDescriptionField,
  buildImageField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { Section } from '@island.is/application/types'
import { signingForm } from '../lib/messages/signingForm'
import RA from '../assets/RA'

export const Signing: Section = buildSection({
  id: 'signing',
  title: signingForm.sectionName,
  children: [
    buildMultiField({
      id: 'signingForm.info',
      title: signingForm.pageTitle,
      description: '',
      children: [
        buildAlertMessageField({
          id: 'signingForm.alert',
          alertType: 'success',
          title: signingForm.alertMessageSuccess,
          marginTop: 0,
        }),
        buildDescriptionField({
          id: 'signingForm.description',
          title: signingForm.pageInfoTitle,
          titleVariant: 'h3',
          description: signingForm.pageInfoDescription,
          marginBottom: 8,
        }),
        buildImageField({
          id: 'signingForm.image',
          title: '',
          width: 'full',
          image: RA,
          imagePosition: 'center',
          alt: 'Undirritun',
        }),
      ],
    }),
  ],
})
