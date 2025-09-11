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
import { Signee } from '@island.is/clients/signature-collection'

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
          titleVariant: 'h4',
        }),
        buildTextField({
          id: 'list.municipality',
          title: m.listMunicipality,
          width: 'full',
          readOnly: true,
          defaultValue: ({ externalData }: Application) => {
            const signee = getValueViaPath<Signee>(
              externalData,
              'candidate.data',
            )
            return signee?.area?.name ?? ''
          },
        }),
        buildTextField({
          id: 'list.name',
          title: m.listName,
          width: 'full',
          required: true,
          maxLength: 80,
        }),
        buildDescriptionField({
          id: 'applicantHeader',
          title: m.applicantActorHeader,
          titleVariant: 'h4',
          space: 'containerGutter',
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
        buildTextField({
          id: 'applicant.name',
          title: m.name,
          width: 'half',
          readOnly: true,
          defaultValue: ({ externalData }: Application) =>
            getValueViaPath(externalData, 'nationalRegistry.data.fullName'),
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
      ],
    }),
  ],
})
