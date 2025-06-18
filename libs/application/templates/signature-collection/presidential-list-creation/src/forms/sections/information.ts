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
import format from 'date-fns/format'

export const information = buildSection({
  id: 'listInformation',
  title: m.information,
  children: [
    buildMultiField({
      id: 'listInformation',
      title: m.listInformationSection,
      description: m.listInformationDescription,
      children: [
        buildDescriptionField({
          id: 'applicantHeader',
          title: m.applicantHeader,
          titleVariant: 'h4',
        }),
        buildTextField({
          id: 'applicant.name',
          title: m.name,
          width: 'full',
          readOnly: true,
          defaultValue: ({ externalData }: Application) =>
            getValueViaPath(externalData, 'nationalRegistry.data.fullName') ||
            '',
        }),
        buildTextField({
          id: 'applicant.nationalId',
          title: m.nationalId,
          width: 'full',
          readOnly: true,
          defaultValue: (application: Application) =>
            formatNationalId(application.applicant),
        }),
        buildPhoneField({
          id: 'applicant.phone',
          title: m.phone,
          width: 'half',
          required: true,
          allowedCountryCodes: ['IS'],
          defaultValue: ({ externalData }: Application) =>
            getValueViaPath(externalData, 'userProfile.data.mobilePhoneNumber'),
        }),
        buildTextField({
          id: 'applicant.email',
          title: m.email,
          width: 'half',
          required: true,
          defaultValue: ({ externalData }: Application) =>
            getValueViaPath(externalData, 'userProfile.data.email'),
        }),
        buildDescriptionField({
          id: 'collectionHeader',
          title: m.collectionHeader,
          titleVariant: 'h4',
          space: 'containerGutter',
        }),
        buildTextField({
          id: 'collection.dateFrom',
          title: m.collectionDateFrom,
          width: 'half',
          readOnly: true,
          defaultValue: ({ externalData }: Application) => {
            return format(
              new Date(externalData.getLatestCollection?.data.startTime),
              'dd.MM.yy',
            )
          },
        }),
        buildTextField({
          id: 'collection.dateTil',
          title: m.collectionDateTil,
          width: 'half',
          readOnly: true,
          defaultValue: ({ externalData }: Application) => {
            return format(
              new Date(externalData.getLatestCollection?.data.endTime),
              'dd.MM.yy',
            )
          },
        }),
      ],
    }),
  ],
})
