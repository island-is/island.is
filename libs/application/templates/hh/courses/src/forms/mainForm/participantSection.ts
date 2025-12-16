import {
  buildCustomField,
  buildLinkField,
  buildMultiField,
  buildRadioField,
  buildSection,
  buildTableRepeaterField,
  buildTextField,
  buildTitleField,
  getValueViaPath,
  NO,
  YES,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import type { Application, FormValue } from '@island.is/application/types'

const isUserParticipating = (answers: FormValue) =>
  getValueViaPath<string>(answers, 'userIsParticipating', YES) === YES

export const participantSection = buildSection({
  id: 'participantSection',
  title: m.participant.sectionTitle,
  children: [
    buildMultiField({
      id: 'participantSectionMultiField',
      title: m.participant.sectionTitle,
      children: [
        buildRadioField({
          id: 'userIsParticipating',
          width: 'half',
          backgroundColor: 'white',
          title: m.participant.userIsParticipatingLabel,
          defaultValue: YES,
          options: [
            {
              label: m.participant.userIsParticipatingYesLabel,
              value: YES,
            },
            {
              label: m.participant.userIsNotParticipatingNoLabel,
              value: NO,
            },
          ],
        }),
        buildTitleField({
          title: m.participant.userInformationTitle,
          titleVariant: 'h4',
          condition: isUserParticipating,
        }),
        buildTextField({
          id: 'applicant.nationalId',
          title: m.participant.userNationalId,
          width: 'half',
          readOnly: true,
          format: '######-####',
          defaultValue: (application: Application) =>
            getValueViaPath<string>(
              application.externalData,
              'identity.data.nationalId',
            ),
          condition: isUserParticipating,
        }),
        buildTextField({
          id: 'applicant.name',
          title: m.participant.userName,
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) =>
            getValueViaPath<string>(
              application.externalData,
              'identity.data.name',
            ),
          condition: isUserParticipating,
        }),
        buildTextField({
          id: 'applicant.email',
          title: m.participant.userEmail,
          width: 'half',
          required: true,
          variant: 'email',
          readOnly: true,
          defaultValue: (application: Application) =>
            getValueViaPath<string>(
              application.externalData,
              'userProfile.data.email',
            ),
          condition: isUserParticipating,
        }),
        buildTextField({
          id: 'applicant.phone',
          title: m.participant.userPhone,
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) =>
            getValueViaPath<string>(
              application.externalData,
              'userProfile.data.mobilePhoneNumber',
            ),
          condition: isUserParticipating,
        }),
        buildLinkField({
          id: 'personalInformation.changeInfo',
          title: m.participant.changeInfo,
          link: '/minarsidur/min-gogn/stillingar/',
          variant: 'text',
          iconProps: { icon: 'arrowForward' },
          justifyContent: 'flexEnd',
          condition: isUserParticipating,
        }),
        buildTableRepeaterField({
          id: 'participantList',
          title: m.participant.participantListTitle,
          table: {
            rows: ['name', 'nationalId', 'email', 'phone'],
            header: [
              m.participant.participantName,
              m.participant.participantNationalId,
              m.participant.participantEmail,
              m.participant.participantPhone,
            ],
          },
          fields: {
            nationalIdWithName: {
              component: 'nationalIdWithName',
              label: m.participant.participantNationalId,
              searchPersons: true,
              required: true,
              showEmailField: true,
              showPhoneField: true,
              phoneRequired: true,
              emailRequired: true,
            },
          },
        }),
        buildCustomField({
          id: 'participantValidation',
          component: 'ParticipantValidation',
        }),
      ],
    }),
  ],
})
