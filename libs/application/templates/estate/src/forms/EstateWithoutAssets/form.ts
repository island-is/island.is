import {
  buildCheckboxField,
  buildCustomField,
  buildDescriptionField,
  buildDividerField,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import {
  Application,
  DefaultEvents,
  Form,
  FormModes,
} from '@island.is/application/types'
import { m } from '../../lib/messages'
import { announcerInfo } from '../sharedSections/announcerInfo'
import { dataCollection } from '../sharedSections/dataCollection'
import { YES } from '../../lib/constants'
import { propertiesFields } from './externalDataFields/propertiesFields'
import { deceasedInfoFields } from '../sharedSections/deceasedInfoFields'
import { EstateMember, EstateRegistrant } from '@island.is/clients/syslumenn'
import { format as formatNationalId } from 'kennitala'

export const form: Form = buildForm({
  id: 'estateWithoutProperty',
  title: '',
  mode: FormModes.DRAFT,
  renderLastScreenBackButton: true,
  renderLastScreenButton: true,
  children: [
    dataCollection,
    announcerInfo,
    buildSection({
      id: 'estateMembers',
      title: m.estateMembersTitle,
      children: [
        buildMultiField({
          id: 'estateMembersInfo',
          title: m.estateMembersTitle,
          description: m.estateMembersSubtitle,
          children: [
            buildCustomField({
              title: '',
              id: 'estate.estateMembers',
              component: 'EstateMembersRepeater',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'properties',
      title: m.properties,
      children: [
        buildMultiField({
          id: 'propertiesInfo',
          title: m.properties,
          description: m.propertiesDescription,
          children: [
            ...propertiesFields,
            buildCheckboxField({
              id: 'acceptDebts',
              title: '',
              defaultValue: [],
              backgroundColor: 'blue',
              large: true,
              options: [
                {
                  label: m.acceptDebtsLabel,
                  value: YES,
                },
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'overview',
      title: m.overviewTitle,
      children: [
        buildMultiField({
          id: 'overview',
          title: m.overviewTitle,
          description: m.overviewSubtitleWithoutAssets,
          children: [
            buildDividerField({}),
            buildDescriptionField({
              id: 'overviewDeceasedHeader',
              title: m.theDeceased,
              titleVariant: 'h3',
              marginBottom: 'gutter',
            }),
            ...deceasedInfoFields,
            buildDescriptionField({
              id: 'space1',
              title: '',
              space: 'gutter',
            }),
            buildDividerField({}),
            buildDescriptionField({
              id: 'space2',
              title: '',
              space: 'gutter',
            }),
            buildCustomField(
              {
                title: '',
                id: 'estateMembersCards',
                component: 'Cards',
                doesNotRequireAnswer: true,
              },
              {
                cards: ({ externalData }: Application) =>
                  (
                    (externalData.syslumennOnEntry.data as {
                      estate: EstateRegistrant
                    })?.estate?.estateMembers ?? []
                  ).map((member: EstateMember) => ({
                    title: member.name,
                    description: [
                      formatNationalId(member.nationalId),
                      member.relation,
                    ],
                  })),
              },
            ),
            buildDescriptionField({
              id: 'space3',
              title: '',
              space: 'gutter',
            }),
            buildDividerField({}),
            buildDescriptionField({
              id: 'space4',
              title: '',
              space: 'gutter',
            }),
            ...propertiesFields,
            buildSubmitField({
              id: 'estateWithoutAssets.submit',
              title: '',
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: m.submitApplication,
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
      ],
    }),
  ],
})
