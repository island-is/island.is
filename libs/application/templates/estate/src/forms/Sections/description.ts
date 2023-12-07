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
      title: (application) =>
        application.answers.selectedEstate === EstateTypes.estateWithoutAssets
          ? /* EIGNALAUST DÁNARBU */
            m.applicationDescriptionTitleEstateWithoutAssets
          : application.answers.selectedEstate === EstateTypes.officialDivision
          ? /* OPINBER SKIPTI */
            m.applicationDescriptionTitleOfficialDivision
          : application.answers.selectedEstate ===
            EstateTypes.permitForUndividedEstate
          ? /* SETA Í ÓSKIPTU BÚI */
            m.applicationDescriptionTitleUndividedEstate
          : /* EINKASKIPTI */
            m.applicationDescriptionTitleDivisionOfEstateByHeirs,
      description: (application) =>
        application.answers.selectedEstate === EstateTypes.estateWithoutAssets
          ? /* EIGNALAUST DÁNARBU */
            m.applicationDescriptionTextEstateWithoutAssets
          : application.answers.selectedEstate === EstateTypes.officialDivision
          ? /* OPINBER SKIPTI */
            m.applicationDescriptionTextOfficialDivision
          : application.answers.selectedEstate ===
            EstateTypes.permitForUndividedEstate
          ? /* SETA Í ÓSKIPTU BÚI */
            m.applicationDescriptionTextUndividedEstate
          : /* EINKASKIPTI */
            m.applicationDescriptionTextDivisionOfEstateByHeirs,
    }),
  ],
})
