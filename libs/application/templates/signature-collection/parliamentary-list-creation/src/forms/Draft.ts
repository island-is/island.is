import {
  buildCheckboxField,
  buildCustomField,
  buildDescriptionField,
  buildDividerField,
  buildForm,
  buildKeyValueField,
  buildMultiField,
  buildPhoneField,
  buildSection,
  buildSubmitField,
  buildTableRepeaterField,
  buildTextField,
} from '@island.is/application/core'
import { DefaultEvents, Form, FormModes } from '@island.is/application/types'
import { Application, UserProfile } from '@island.is/api/schema'
import { format as formatNationalId } from 'kennitala'
import Logo from '../../../assets/Logo'

import { m } from '../lib/messages'
import { formatPhone } from '../lib/utils'

export const Draft: Form = buildForm({
  id: 'ParliamentaryListCreationDraft',
  title: '',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  logo: Logo,
  children: [
    buildSection({
      id: 'screen1',
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
              titleVariant: 'h3',
            }),
            buildTextField({
              id: 'list.name',
              title: m.name,
              width: 'full',
              readOnly: true,
              defaultValue: 'Flokkur 1 - Listabókstafur',
            }),
            buildTextField({
              id: 'list.nationalId',
              title: m.nationalId,
              width: 'full',
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
              defaultValue: ({ externalData }: Application) => {
                return externalData.nationalRegistry?.data.fullName
              },
            }),
            buildTextField({
              id: 'applicant.nationalId',
              title: m.nationalId,
              width: 'half',
              readOnly: true,
              defaultValue: (application: Application) =>
                formatNationalId(application.applicant),
            }),
            buildPhoneField({
              id: 'applicant.phone',
              title: m.phone,
              width: 'half',
              required: true,
              disableDropdown: true,
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
            buildDescriptionField({
              id: 'collectionHeader',
              title: m.collectionHeader,
              titleVariant: 'h3',
              space: 'containerGutter',
            }),
            buildTextField({
              id: 'collection.dateFrom',
              title: m.collectionDateFrom,
              width: 'half',
              readOnly: true,
              defaultValue: new Date().toLocaleDateString('is-IS'),
            }),
            buildTextField({
              id: 'collection.dateTil',
              title: m.collectionDateTil,
              width: 'half',
              readOnly: true,
              defaultValue: new Date().toLocaleDateString('is-IS'),
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'constituency',
      title: 'Veljið kjördæmi',
      children: [
        buildMultiField({
          id: 'constituency',
          title: 'Veljið kjördæmi',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
          children: [
            buildCheckboxField({
              id: 'constituency',
              title: '',
              large: true,
              defaultValue: [
                'nordaustur',
                'nordvestur',
                'reykjavik',
                'reykjanes',
                'sudvestur',
                'sudaustur',
              ],
              options: [
                { value: 'nordaustur', label: 'Norðausturkjördæmi' },
                { value: 'nordvestur', label: 'Norðvesturkjördæmi' },
                { value: 'reykjavik', label: 'Reykjavíkurkjördæmi norður' },
                { value: 'reykjanes', label: 'Reykjavíkurkjördæmi suður' },
                { value: 'sudvestur', label: 'Suðurkjördæmi' },
                { value: 'sudaustur', label: 'Suðausturkjördæmi' },
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'guarantors',
      title: 'Umsjónar-/ábyrgðaraðilar',
      children: [
        buildMultiField({
          id: 'guarantors',
          title: 'Veljið umsjónar-/ábyrgðaraðila',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
          children: [
            buildTableRepeaterField({
              id: 'guarantors',
              title: 'Ábyrgðaraðilar',
              description:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce aliquet imperdiet odio.',
              addItemButtonText: 'Bæta við ábyrgðaraðila',
              marginTop: 0,
              fields: {
                nationalId: {
                  component: 'nationalIdWithName',
                },
                constituency: {
                  component: 'select',
                  label: 'Kjördæmi',
                  width: 'full',
                  backgroundColor: 'white',
                  options: [
                    {
                      value: 'Öll kjördæmi',
                      label: 'Öll kjördæmi',
                    },
                  ],
                },
              },
              table: {
                format: {
                  nationalId: (value) => formatNationalId(value),
                },
                header: ['Kennitala', 'Nafn', 'Kjördæmi'],
              },
            }),
            buildTableRepeaterField({
              id: 'supervisors',
              title: 'Umsjónaraðilar',
              description:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce aliquet imperdiet odio.',
              addItemButtonText: 'Bæta við umsjónaraðila',
              marginTop: 5,
              fields: {
                nationalId: {
                  component: 'nationalIdWithName',
                },
                constituency: {
                  component: 'select',
                  label: 'Kjördæmi',
                  width: 'full',
                  backgroundColor: 'white',
                  isMulti: true,
                  options: [
                    {
                      value: 'Norðausturkjördæmi',
                      label: 'Norðausturkjördæmi',
                    },
                    {
                      value: 'Norðvesturkjördæmi',
                      label: 'Norðvesturkjördæmi',
                    },
                    {
                      value: 'Reykjavíkurkjördæmi norður',
                      label: 'Reykjavíkurkjördæmi norður',
                    },
                    {
                      value: 'Reykjavíkurkjördæmi suður',
                      label: 'Reykjavíkurkjördæmi suður',
                    },
                    { value: 'Suðurkjördæmi', label: 'Suðurkjördæmi' },
                    { value: 'Suðausturkjördæmi', label: 'Suðausturkjördæmi' },
                  ],
                },
              },
              table: {
                format: {
                  nationalId: (value) => formatNationalId(value),
                },
                header: ['Kennitala', 'Nafn', 'Kjördæmi'],
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
              id: 'applicantOverview',
              title: m.applicantOverviewHeader,
              titleVariant: 'h3',
              space: 'gutter',
              marginBottom: 3,
            }),
            buildKeyValueField({
              label: m.name,
              width: 'half',
              value: ({ answers }) => {
                return (answers.applicant as any).name
              },
            }),
            buildKeyValueField({
              label: m.nationalId,
              width: 'half',
              value: ({ answers }) => {
                return (answers.applicant as any).nationalId
              },
            }),
            buildDescriptionField({
              id: 'space',
              title: '',
              space: 'gutter',
            }),
            buildKeyValueField({
              label: m.phone,
              width: 'half',
              value: ({ answers }) => {
                return formatPhone((answers.applicant as any).phone)
              },
            }),
            buildKeyValueField({
              label: m.email,
              width: 'half',
              value: ({ answers }) => {
                return (answers.applicant as any).email
              },
            }),
            buildDescriptionField({
              id: 'space1',
              title: '',
              space: 'gutter',
            }),
            buildDividerField({}),
            buildDescriptionField({
              id: 'listOverview',
              title: m.listOverviewHeader,
              titleVariant: 'h3',
              space: 'gutter',
              marginBottom: 3,
            }),
            buildCustomField({
              id: 'createdLists',
              title: '',
              component: 'ListsInOverview',
            }),
            buildDescriptionField({
              id: 'space2',
              title: 'Ábyrgðaraðilar',
              titleVariant: 'h3',
              space: 'gutter',
              marginBottom: 3,
            }),
            buildKeyValueField({
              label: '',
              width: 'half',
              value: ({ answers }) => {
                return (answers.guarantors as any)
                  .map(
                    (g: any) =>
                      g.name + ' - ' + g.role + ' - ' + g.constituency,
                  )
                  .join('\n')
              },
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
    /* Section setup for the stepper */
    buildSection({
      id: 'done',
      title: m.listCreated,
      children: [],
    }),
  ],
})
