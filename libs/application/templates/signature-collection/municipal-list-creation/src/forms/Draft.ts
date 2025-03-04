import {
  buildCheckboxField,
  buildDescriptionField,
  buildDividerField,
  buildForm,
  buildMultiField,
  buildOverviewField,
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
import {
  formatPhoneNumber,
  removeCountryCode,
} from '@island.is/application/ui-components'

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
                const phone = getValueViaPath<string>(
                  application.externalData,
                  'userProfile.data.mobilePhoneNumber',
                )

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
            buildOverviewField({
              id: 'overviewList',
              title: m.listOverviewHeader,
              marginTop: 'none',
              marginBottom: 'none',
              items: (answers) => [
                {
                  width: 'full',
                  keyText: m.listMunicipality,
                  valueText:
                    getValueViaPath<string>(answers, 'list.municipality') ?? '',
                },
                {
                  width: 'full',
                  keyText: m.listName,
                  valueText:
                    getValueViaPath<string>(answers, 'list.name') ?? '',
                },
              ],
            }),
            buildOverviewField({
              id: 'overviewApplicant',
              title: m.applicantOverviewHeader,
              marginTop: 'none',
              marginBottom: 'none',
              items: (answers) => [
                {
                  width: 'half',
                  keyText: m.nationalId,
                  valueText:
                    getValueViaPath<string>(answers, 'applicant.nationalId') ??
                    '',
                },
                {
                  width: 'half',
                  keyText: m.name,
                  valueText:
                    getValueViaPath<string>(answers, 'applicant.name') ?? '',
                },
                {
                  width: 'half',
                  keyText: m.phone,
                  valueText: () => {
                    const phone =
                      getValueViaPath<string>(answers, 'applicant.phone') ?? ''
                    return formatPhoneNumber(removeCountryCode(phone))
                  },
                },
                {
                  width: 'half',
                  keyText: m.email,
                  valueText:
                    getValueViaPath<string>(answers, 'applicant.email') ?? '',
                },
              ],
            }),
            buildDividerField({})
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
