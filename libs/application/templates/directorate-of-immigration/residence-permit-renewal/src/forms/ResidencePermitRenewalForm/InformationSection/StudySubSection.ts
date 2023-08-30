import {
  buildMultiField,
  buildSubSection,
  buildDescriptionField,
  getValueViaPath,
  buildCustomField,
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

      return true //TODO: SET RIGHT CONDITION isForApplicant && isPermitTypeStudy
    },
    children: [
      buildMultiField({
        id: 'studyMultiField',
        title: information.labels.study.pageTitle,
        description: information.labels.study.description,
        children: [
          buildCustomField({
            id: 'study',
            title: information.labels.study.subSectionTitle,
            component: 'StudyInformation',
          }),
        ],
      }),
    ],
  })
