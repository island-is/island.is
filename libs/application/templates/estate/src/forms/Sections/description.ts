import {
  buildDescriptionField,
  buildSection,
} from '@island.is/application/core'

import { m } from '../../lib/messages'
import { EstateTypes } from '../../lib/constants'

export const applicationDescription = buildSection({
  id: 'applicationDescription',
  title: m.applicationDescriptionSectionTitle,
  children: [
    buildDescriptionField({
      id: 'applicationDescription',
      space: 2,
      title: ({ answers }) =>
        answers.selectedEstate === EstateTypes.estateWithoutAssets
          ? /* EIGNALAUST DÁNARBU */
            m.applicationDescriptionTitleEstateWithoutAssets
          : answers.selectedEstate === EstateTypes.officialDivision
          ? /* OPINBER SKIPTI */
            m.applicationDescriptionTitleOfficialDivision
          : answers.selectedEstate === EstateTypes.permitForUndividedEstate
          ? /* SETA Í ÓSKIPTU BÚI */
            m.applicationDescriptionTitleUndividedEstate
          : /* EINKASKIPTI */
            m.applicationDescriptionTitleDivisionOfEstateByHeirs,
      description: ({ answers }) =>
        answers.selectedEstate === EstateTypes.estateWithoutAssets
          ? /* EIGNALAUST DÁNARBU */
            m.applicationDescriptionTextEstateWithoutAssets
          : answers.selectedEstate === EstateTypes.officialDivision
          ? /* OPINBER SKIPTI */
            m.applicationDescriptionTextOfficialDivision
          : answers.selectedEstate === EstateTypes.permitForUndividedEstate
          ? /* SETA Í ÓSKIPTU BÚI */
            m.applicationDescriptionTextUndividedEstate
          : /* EINKASKIPTI */
            m.applicationDescriptionTextDivisionOfEstateByHeirs,
    }),
  ],
})
