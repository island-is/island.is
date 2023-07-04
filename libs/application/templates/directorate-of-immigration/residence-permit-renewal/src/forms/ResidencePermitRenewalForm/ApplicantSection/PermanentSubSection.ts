import {
  buildMultiField,
  buildSubSection,
  buildDescriptionField,
  getValueViaPath,
} from '@island.is/application/core'
import { applicant } from '../../../lib/messages'

export const PermanentSubSection = buildSubSection({
  id: 'permanent',
  title: applicant.labels.permanent.subSectionTitle,
  condition: (_, externalData) => {
    //TODOx should check kids as well
    const canApplyPermanent = getValueViaPath(
      externalData,
      'currentResidencePermit.data.canApplyPermanent.canApply',
      false,
    ) as boolean

    return canApplyPermanent
  },
  children: [
    buildMultiField({
      id: 'permanentMultiField',
      title: applicant.labels.permanent.pageTitle,
      description: applicant.labels.permanent.description,
      children: [
        buildDescriptionField({
          id: 'permanent.title',
          title: applicant.labels.permanent.title,
          titleVariant: 'h5',
        }),
      ],
    }),
  ],
})
