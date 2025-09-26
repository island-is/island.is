import {
  buildRadioField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { ApplicantsRole } from '../../../utils/enums'

export const assignApplicantPatySubsection = buildSubSection({
  id: 'assignApplicantPartySubsection',
  title: 'Hlutverk',
  children: [
    buildMultiField({
      id: 'assignApplicantPartyMultiField',
      title: 'Hlutverk',
      description: 'Vinsamlegast tilgreindu þitt hlutverk í leigusamningnum',
      children: [
        buildRadioField({
          id: 'assignApplicantParty.applicantsRole',
          options: [
            {
              label: 'Ég er leigusali',
              value: ApplicantsRole.LANDLORD,
            },
            {
              label: 'Ég er umboðsmaður leigusala',
              value: ApplicantsRole.REPRESENTATIVE,
            },
            {
              label: 'Ég er leigjandi',
              value: ApplicantsRole.TENANT,
            },
          ],
        }),
      ],
    }),
  ],
})
