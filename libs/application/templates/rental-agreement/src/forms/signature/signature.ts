import {
  buildDescriptionField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { signature } from '../../lib/messages'

export const Signature = buildSection({
  id: 'signature',
  title: signature.sectionName,
  children: [
    buildMultiField({
      id: 'signature',
      title: signature.pageTitle,
      description: signature.pageDescription,
      children: [
        buildDescriptionField({
          id: 'signature.description',
          title: 'signature.signatureDescription',
          titleVariant: 'h3',
        }),
      ],
    }),
  ],
})
