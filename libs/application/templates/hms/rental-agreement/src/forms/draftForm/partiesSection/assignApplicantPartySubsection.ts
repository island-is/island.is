import {
  buildRadioField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { applicantIsIndividual } from '../../../utils/conditions'
import { ApplicantsRole } from '../../../utils/enums'
import * as m from '../../../lib/messages'

export const assignApplicantPartySubsection = buildSubSection({
  id: 'assignApplicantPartySubsection',
  title: m.assignApplicantParty.applicantRole,
  condition: applicantIsIndividual,
  children: [
    buildMultiField({
      id: 'assignApplicantPartyMultiField',
      title: m.assignApplicantParty.applicantRole,
      description: m.assignApplicantParty.applicantRoleDescription,
      children: [
        buildRadioField({
          id: 'assignApplicantParty.applicantsRole',
          options: [
            {
              label: m.assignApplicantParty.iAmLandlord,
              value: ApplicantsRole.LANDLORD,
            },
            {
              label: m.assignApplicantParty.iAmRepresentative,
              value: ApplicantsRole.REPRESENTATIVE,
            },
            {
              label: m.assignApplicantParty.iAmTenant,
              value: ApplicantsRole.TENANT,
            },
          ],
        }),
      ],
    }),
  ],
})
