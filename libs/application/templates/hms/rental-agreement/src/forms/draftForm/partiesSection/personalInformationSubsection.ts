import { buildSubSection } from '@island.is/application/core'
import { Routes } from '../../../utils/enums'
import * as m from '../../../lib/messages'
import { applicantInformationMultiField } from '@island.is/application/ui-forms'

export const personalInformationSubsection = buildSubSection({
  id: Routes.PERSONALINFORMATION,
  title: m.personalInformation.title,
  children: [
    applicantInformationMultiField({
      applicantInformationDescription:
        m.partiesDetails.personalInformationDescription,
    }),
  ],
})
