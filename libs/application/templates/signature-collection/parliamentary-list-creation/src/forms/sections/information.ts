import {
  buildDescriptionField,
  buildMultiField,
  buildPhoneField,
  buildSection,
  buildTextField,
  getValueViaPath,
} from '@island.is/application/core'
import { format as formatNationalId } from 'kennitala'
import { m } from '../../lib/messages'
import { Application } from '@island.is/api/schema'

export const information = buildSection({
  id: 'listInformationSection',
  title: m.information,
  children: [
    buildMultiField({
      id: 'listInformation',
      title: m.listInformationSection,
      description: m.listInformationDescription,
      children: [
        buildDescriptionField({
          id: 'listHeader',
          title: m.listHeader,
          titleVariant: 'h3',
        }),
        buildTextField({
          id: 'list.name',
          title: m.listName,
          width: 'full',
          readOnly: true,
          defaultValue: ({ externalData }: Application) =>
            getValueViaPath(
              externalData,
              'candidate.data.partyBallotLetterInfo.name',
            ) ?? '',
        }),
        buildTextField({
          id: 'list.letter',
          title: m.listLetter,
          width: 'half',
          readOnly: true,
          defaultValue: ({ externalData }: Application) =>
            getValueViaPath(
              externalData,
              'candidate.data.partyBallotLetterInfo.letter',
            ) ?? '',
        }),
        buildTextField({
          id: 'list.nationalId',
          title: m.nationalId,
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) =>
            formatNationalId(application.applicant),
        }),
        buildDescriptionField({
          id: 'applicantHeader',
          title: m.applicantActorHeader,
          titleVariant: 'h3',
          space: 'containerGutter',
        }),
        buildTextField({
          id: 'applicant.name',
          title: m.name,
          width: 'half',
          readOnly: true,
          defaultValue: ({ externalData }: Application) =>
            getValueViaPath(
              externalData,
              'parliamentaryIdentity.data.fullName',
            ) ?? '',
        }),
        buildTextField({
          id: 'applicant.nationalId',
          title: m.nationalId,
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) =>
            application?.applicantActors[0]
              ? formatNationalId(application?.applicantActors[0])
              : formatNationalId(application.applicant),
        }),
        buildPhoneField({
          id: 'applicant.phone',
          title: m.phone,
          width: 'half',
          required: true,
          allowedCountryCodes: ['IS'],
          defaultValue: ({ externalData }: Application) =>
            getValueViaPath(
              externalData,
              'userProfile.data.mobilePhoneNumber',
            ) ?? '',
        }),
        buildTextField({
          id: 'applicant.email',
          title: m.email,
          width: 'half',
          required: true,
          defaultValue: ({ externalData }: Application) =>
            getValueViaPath(externalData, 'userProfile.data.email') ?? '',
        }),
      ],
    }),
  ],
})
