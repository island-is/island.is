import {
  buildMultiField,
  buildSubSection,
  buildDescriptionField,
  getValueViaPath,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'

export const OtherDocumentsSubSection = (index: number) =>
  buildSubSection({
    id: 'otherDocuments',
    title: information.labels.otherDocuments.subSectionTitle,
    condition: (_, externalData) => {
      const isForApplicant = index === 0

      const isPermitTypeFamily = getValueViaPath(
        externalData,
        'applicantCurrentResidencePermitType.data.isPermitTypeFamily',
        false,
      ) as boolean

      const isPermitTypeStudy = getValueViaPath(
        externalData,
        'applicantCurrentResidencePermitType.data.isPermitTypeStudy',
        false,
      ) as boolean

      return !isForApplicant || isPermitTypeFamily || isPermitTypeStudy
    },
    children: [
      buildMultiField({
        id: 'otherDocumentsMultiField',
        title: information.labels.otherDocuments.pageTitle,
        description: information.labels.otherDocuments.description,
        children: [
          buildDescriptionField({
            id: 'otherDocuments.title',
            title: information.labels.otherDocuments.title,
            titleVariant: 'h5',
          }),
        ],
      }),
    ],
  })
