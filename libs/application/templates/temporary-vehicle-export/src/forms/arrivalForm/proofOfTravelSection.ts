import {
  buildFileUploadField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { PROOF_OF_TRAVEL_FILE_TYPES } from '../../utils/constants'

export const proofOfTravelSection = buildSection({
  id: 'proofOfTravelSection',
  title: m.proofOfTravel.sectionTitle,
  children: [
    buildMultiField({
      id: 'proofOfTravelMultiField',
      title: m.proofOfTravel.title,
      description: m.proofOfTravel.description,
      children: [
        buildFileUploadField({
          id: 'proofOfTravel',
          uploadMultiple: true,
          uploadAccept: PROOF_OF_TRAVEL_FILE_TYPES,
          uploadHeader: m.proofOfTravel.uploadHeader,
          uploadDescription: m.proofOfTravel.uploadDescription,
        }),
      ],
    }),
  ],
})
