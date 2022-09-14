import {
  buildCheckboxField,
  buildDescriptionField,
  buildDividerField,
  buildForm,
  buildKeyValueField,
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents, Form, FormModes } from '@island.is/application/types'
import { m } from '../../lib/messages'
import { announcerInfo } from '../sharedSections/announcerInfo'
import { dataCollection } from '../sharedSections/dataCollection'
import { NO, YES } from '../../lib/constants'
import format from 'date-fns/format'
import { estateMembersFields } from './externalDataFields/estateMembersFields'
import { propertiesFields } from './externalDataFields/propertiesFields'

export const form: Form = buildForm({
  id: 'estateWithoutProperty',
  title: '',
  mode: FormModes.APPLYING,
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
          children: estateMembersFields,
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
              defaultValue: NO,
              backgroundColor: 'white',
              large: false,
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
          description: m.overviewSubtitleWithNoProperty,
          children: [
            buildDividerField({}),
            buildDescriptionField({
              id: 'overviewDeceasedHeader',
              title: m.theDeceased,
              titleVariant: 'h3',
              marginBottom: 'gutter',
            }),
            buildDescriptionField({
              id: 'deceasedName',
              title: m.name,
              titleVariant: 'h4',
              marginBottom: 'gutter',
              width: 'half',
              description: ({
                externalData: {
                  syslumennOnEntry: { data },
                },
              }) => (data as any)?.estate.nameOfDeceased,
            }),
            buildDescriptionField({
              id: 'deceasedNationalId',
              title: m.nationalId,
              titleVariant: 'h4',
              marginBottom: 'gutter',
              width: 'half',
              description: ({
                externalData: {
                  syslumennOnEntry: { data },
                },
              }) => (data as any)?.estate.nationalIdOfDeceased,
            }),
            buildDescriptionField({
              id: 'deceasedDeathDate',
              title: m.deathDate,
              titleVariant: 'h4',
              marginBottom: 'gutter',
              width: 'half',
              description: ({
                externalData: {
                  syslumennOnEntry: { data },
                },
              }) =>
                format(
                  new Date((data as any)?.estate.dateOfDeath),
                  'dd/MM/yyyy',
                ),
            }),
            buildDescriptionField({
              id: 'deceasedAddress',
              title: m.address,
              titleVariant: 'h4',
              marginBottom: 'gutter',
              width: 'half',
              description: ({
                externalData: {
                  syslumennOnEntry: { data },
                },
              }) => (data as any)?.estate.address ?? 'La la Land 123', // TODO: address this with API about getting lögheimili',
            }),
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
            ...estateMembersFields,
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
            buildKeyValueField({
              label: m.acceptDebtsLabel,
              value: ({ answers: { acceptDebts } }) => acceptDebts as string,
            }),
            buildSubmitField({
              id: 'estateWithNoProperty.submit',
              title: '',
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Senda inn tilkynningu',
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
