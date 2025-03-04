import {
  buildCheckboxField,
  buildDescriptionField,
  buildDividerField,
  buildForm,
  buildKeyValueField,
  buildMultiField,
  buildPhoneField,
  buildSection,
  buildSubmitField,
  buildTextField,
  getValueViaPath,
  YES,
} from '@island.is/application/core'
import { DefaultEvents, Form, FormModes } from '@island.is/application/types'
import { Application, UserProfile } from '@island.is/api/schema'
import { format as formatNationalId } from 'kennitala'
import Logo from '../../assets/Logo'

import { m } from '../lib/messages'
import { formatPhone } from '../lib/utils'

export const Draft: Form = buildForm({
  id: 'MunicipalListCreationDraft',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  logo: Logo,
  children: [
    buildSection({
      id: 'screen1',
      title: m.intro,
      children: [],
    }),
    buildSection({
      id: 'screen2',
      title: m.dataCollection,
      children: [],
    }),
    buildSection({
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
              //Todo: use value from externalData once available
              defaultValue: () => 'Borgarbyggð',
            }),
            buildTextField({
              id: 'list.name',
              title: m.listName,
              width: 'full',
              required: true,
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
              defaultValue: ({ externalData }: Application) => {
                return externalData.nationalRegistry?.data?.fullName || ''
              },
            }),
            buildPhoneField({
              id: 'applicant.phone',
              title: m.phone,
              width: 'half',
              required: true,
              allowedCountryCodes: ['IS'],
              defaultValue: (application: Application) => {
                const phone =
                  (
                    application.externalData.userProfile?.data as {
                      mobilePhoneNumber?: string
                    }
                  )?.mobilePhoneNumber ?? ''

                return phone
              },
            }),
            buildTextField({
              id: 'applicant.email',
              title: m.email,
              width: 'half',
              required: true,
              defaultValue: ({ externalData }: Application) => {
                const data = externalData.userProfile?.data as UserProfile
                return data?.email
              },
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'overview',
      title: m.overview,
      children: [
        buildMultiField({
          id: 'overview',
          title: m.overview,
          description: m.overviewDescription,
          children: [
            buildDividerField({}),
            buildDescriptionField({
              id: 'listOverview',
              title: m.listOverviewHeader,
              titleVariant: 'h3',
              space: 'gutter',
              marginBottom: 3,
            }),
            buildKeyValueField({
              label: m.listMunicipality,
              width: 'full',
              value: ({ answers }) =>
                getValueViaPath(answers, 'list.municipality') ?? '',
            }),
            buildDescriptionField({
              id: 'space',
              space: 'gutter',
            }),
            buildKeyValueField({
              label: m.listName,
              width: 'half',
              value: ({ answers }) =>
                getValueViaPath(answers, 'list.name') ?? '',
            }),
            buildDescriptionField({
              id: 'space1',
              space: 'gutter',
            }),
            buildDividerField({}),
            buildDescriptionField({
              id: 'applicantOverview',
              title: m.applicantOverviewHeader,
              titleVariant: 'h3',
              space: 'gutter',
              marginBottom: 3,
            }),
            buildKeyValueField({
              label: m.nationalId,
              width: 'half',
              value: ({ answers }) =>
                getValueViaPath(answers, 'applicant.nationalId') ?? '',
            }),
            buildKeyValueField({
              label: m.name,
              width: 'half',
              value: ({ answers }) =>
                getValueViaPath(answers, 'applicant.name') ?? '',
            }),
            buildDescriptionField({
              id: 'space2',
              space: 'gutter',
            }),
            buildKeyValueField({
              label: m.phone,
              width: 'half',
              value: ({ answers }) => {
                const phone = getValueViaPath<string>(
                  answers,
                  'applicant.phone',
                )
                return phone ? formatPhone(phone) : ''
              },
            }),
            buildKeyValueField({
              label: m.email,
              width: 'half',
              value: ({ answers }) =>
                getValueViaPath(answers, 'applicant.email') ?? '',
            }),
            buildDescriptionField({
              id: 'space3',
              space: 'gutter',
            }),
            buildDividerField({}),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'confirmCreation',
      title: m.confirmCreation,
      children: [
        buildMultiField({
          id: 'confirmCreation',
          title: m.confirmCreation,
          description: m.confirmCreationDescription,
          children: [
            buildDescriptionField({
              id: 'confirmSpace',
              title: '',
              space: 'containerGutter',
              titleVariant: 'h3',
            }),
            buildCheckboxField({
              id: 'confirmCreationCheckbox',
              large: true,
              title: '',
              options: [{ value: YES, label: m.confirmCreationCheckboxLabel }],
            }),
            buildSubmitField({
              id: 'submit',
              placement: 'footer',
              title: m.createList,
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: m.createList,
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'done',
      title: m.listCreated,
      children: [],
    }),
  ],
})
