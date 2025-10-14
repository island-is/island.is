import {
  buildAlertMessageField,
  buildDescriptionField,
  buildSection,
  buildImageField,
  buildForm,
  buildMultiField,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import RA from '../../assets/RA'
import Logo from '../../assets/Logo'
import * as m from '../../lib/messages'

export const SigningForm: Form = buildForm({
  id: 'SigningForm',
  title: m.application.name,
  logo: Logo,
  mode: FormModes.IN_PROGRESS,
  renderLastScreenButton: true,
  children: [
    buildSection({
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
    }),
  ],
})
