import {
  buildRadioField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { ApplicantsRole } from '../../../utils/enums'
import * as m from '../../../lib/messages'

export const assignApplicantPartySubsection = buildSubSection({
  id: 'assignApplicantPartySubsection',
  title: m.assignApplicantPartyMessages.applicantRole,
  children: [
    buildMultiField({
      id: 'assignApplicantPartyMultiField',
      title: m.assignApplicantPartyMessages.applicantRole,
      description: m.assignApplicantPartyMessages.applicantRoleDescription,
      children: [
        buildRadioField({
          id: 'assignApplicantParty.applicantsRole',
          options: [
            {
              label: m.assignApplicantPartyMessages.iAmLandlord,
              value: ApplicantsRole.LANDLORD,
            },
            {
              label: m.assignApplicantPartyMessages.iAmRepresentative,
              value: ApplicantsRole.REPRESENTATIVE,
            },
            {
              label: m.assignApplicantPartyMessages.iAmTenant,
              value: ApplicantsRole.TENANT,
            },
          ],
        }),
      ],
    }),
  ],
})
