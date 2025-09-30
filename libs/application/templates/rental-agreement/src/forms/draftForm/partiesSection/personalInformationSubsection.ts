import { buildSubSection } from '@island.is/application/core'
import { Routes } from '../../../utils/enums'
import * as m from '../../../lib/messages'
import { applicantInformationMultiField } from 'libs/application/ui-forms/src/lib/applicantInformationMultiField'

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
