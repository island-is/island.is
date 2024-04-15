import {
  buildMultiField,
  buildSubSection,
  buildDescriptionField,
} from '@island.is/application/core'
import { Routes } from '../../../lib/constants'
import { idInformation } from '../../../lib/messages/idInformation'

export const TypeOfIdSubSection = buildSubSection({
  id: Routes.TYPEOFID,
  title: idInformation.general.typeofIdSectionTitle,
  children: [
    buildMultiField({
      id: Routes.TYPEOFID,
      title: 'TODO type of id multifield title',
      children: [
        buildDescriptionField({
          id: `${Routes.TYPEOFID}.title`,
          title: 'type of id description field title',
          titleVariant: 'h5',
        }),
      ],
    }),
  ],
})
