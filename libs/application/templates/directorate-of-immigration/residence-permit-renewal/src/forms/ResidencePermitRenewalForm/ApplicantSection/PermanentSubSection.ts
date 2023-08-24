import {
  buildMultiField,
  buildSubSection,
  buildDescriptionField,
  getValueViaPath,
} from '@island.is/application/core'
import { CurrentResidencePermit } from '@island.is/clients/directorate-of-immigration'
import { applicant } from '../../../lib/messages'

export const PermanentSubSection = buildSubSection({
  id: 'permanent',
  title: applicant.labels.permanent.subSectionTitle,
  condition: (_, externalData) => {
    const applicantCurrentResidencePermit = getValueViaPath(
      externalData,
      'applicantCurrentResidencePermit.data',
    ) as CurrentResidencePermit

    const childrenCurrentResidencePermit = getValueViaPath(
      externalData,
      'childrenCurrentResidencePermit.data',
      [],
    ) as CurrentResidencePermit[]

    const canAtLeastOneApplyPermanent = !![
      applicantCurrentResidencePermit,
      ...childrenCurrentResidencePermit,
    ].find((x) => x.canApplyPermanent)

    return canAtLeastOneApplyPermanent
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
