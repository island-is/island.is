import {
  buildMultiField,
  buildSubSection,
  buildDescriptionField,
  getValueViaPath,
} from '@island.is/application/core'
import { CurrentResidencePermit } from '@island.is/clients/directorate-of-immigration/residence-permit'
import { applicant } from '../../../lib/messages'

export const PermanentSubSection = buildSubSection({
  id: 'permanent',
  title: applicant.labels.permanent.subSectionTitle,
  condition: (_, externalData) => {
    const currentResidencePermitList = getValueViaPath(
      externalData,
      'currentResidencePermitList.data',
      [],
    ) as CurrentResidencePermit[]

    const canOneApplyPermanent = !!currentResidencePermitList.find(
      (x) => x.canApplyPermanent,
    )
    return canOneApplyPermanent
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
