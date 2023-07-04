import {
  buildMultiField,
  buildSubSection,
  buildDescriptionField,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'

export const PassportSubSection = (index: number) =>
  buildSubSection({
    id: 'passport',
    title: information.labels.passport.subSectionTitle,
    children: [
      buildMultiField({
        id: 'passportMultiField',
        title: information.labels.passport.pageTitle,
        description: information.labels.passport.description,
        children: [
          buildDescriptionField({
            id: 'passport.title',
            title: information.labels.passport.title,
            titleVariant: 'h5',
          }),
        ],
      }),
    ],
  })
