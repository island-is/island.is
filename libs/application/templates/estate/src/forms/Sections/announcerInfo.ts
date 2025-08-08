import { Application } from '@island.is/api/schema'
import {
  buildMultiField,
  buildPhoneField,
  buildRadioField,
  buildSection,
  buildSelectField,
  buildTextField,
  getValueViaPath,
} from '@island.is/application/core'
import { JA, YES, NEI, NO, EstateTypes } from '../../lib/constants'
import { m } from '../../lib/messages'
import { format as formatNationalId } from 'kennitala'

export const announcerInfo = buildSection({
  id: 'information',
  title: ({ answers }) =>
    answers.selectedEstate === EstateTypes.estateWithoutAssets
      ? m.announcerNoAssets
      : answers.selectedEstate === EstateTypes.permitForUndividedEstate
      ? m.announcerPTP
      : m.announcer,
  children: [
    buildMultiField({
      id: 'applicant',
      title: ({ answers }) =>
        answers.selectedEstate === EstateTypes.estateWithoutAssets
          ? m.announcerNoAssets
          : answers.selectedEstate === EstateTypes.permitForUndividedEstate
          ? m.announcerPermitToPostpone
          : m.announcer,
      description: m.applicantsInfoSubtitle,
      children: [
        buildTextField({
          id: 'applicant.name',
          title: m.name,
          readOnly: true,
          width: 'half',
          defaultValue: ({ externalData }: Application) =>
            getValueViaPath(externalData, 'nationalRegistry.data.fullName') ??
            '',
        }),
        buildTextField({
          id: 'applicant.nationalId',
          title: m.nationalId,
          readOnly: true,
          width: 'half',
          defaultValue: ({ externalData }: Application) =>
            formatNationalId(
              getValueViaPath(
                externalData,
                'nationalRegistry.data.nationalId',
              ) ?? '',
            ),
        }),
        buildTextField({
          id: 'applicant.address',
          title: m.address,
          readOnly: true,
          width: 'half',
          defaultValue: ({ externalData }: Application) =>
            getValueViaPath(
              externalData,
              'nationalRegistry.data.address.streetAddress',
            ) ?? '',
        }),
        buildPhoneField({
          id: 'applicant.phone',
          title: m.phone,
          width: 'half',
          required: true,
          enableCountrySelector: true,
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
        buildSelectField({
          id: 'applicant.relationToDeceased',
          title: m.relationToDeceased,
          required: true,
          condition: (answers) =>
            answers.selectedEstate === EstateTypes.estateWithoutAssets,
          width: 'half',
          options: ({
            externalData: {
              syslumennOnEntry: { data },
            },
          }) => {
            return (data as { relationOptions: string[] }).relationOptions.map(
              (option) => ({
                value: option,
                label: option,
              }),
            )
          },
        }),
        buildRadioField({
          id: 'applicant.autonomous',
          title: m.applicantAutonomous,
          width: 'half',
          defaultValue: YES,
          condition: (answers) =>
            answers.selectedEstate === EstateTypes.permitForUndividedEstate,
          largeButtons: false,
          space: 8,
          options: [
            { label: JA, value: YES },
            { label: NEI, value: NO },
          ],
        }),
      ],
    }),
  ],
})
