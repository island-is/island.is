import {
  buildMultiField,
  buildSubSection,
  buildDescriptionField,
  getValueViaPath,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'

export const StudySubSection = (index: number) =>
  buildSubSection({
    id: 'study',
    title: information.labels.study.subSectionTitle,
    condition: (_, externalData) => {
      const isForApplicant = index === 0

      const isPermitTypeStudy = getValueViaPath(
        externalData,
        'applicantCurrentResidencePermitType.data.isPermitTypeStudy',
        false,
      ) as boolean

      return isForApplicant && isPermitTypeStudy
    },
    children: [
      buildMultiField({
        id: 'studyMultiField',
        title: information.labels.study.pageTitle,
        description: information.labels.study.description,
        children: [
          buildDescriptionField({
            id: 'study.title',
            title: information.labels.study.title,
            titleVariant: 'h5',
          }),
        ],
      }),
    ],
  })
