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
import { estateMembersFields } from './externalDataFields/estateMembersFields'
import { propertiesFields } from './externalDataFields/propertiesFields'
import { deceasedInfoFields } from '../sharedSections/deceasedInfoFields'

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
              defaultValue: [],
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
              value: ({ answers: { acceptDebts } }) =>
                (acceptDebts as string[]).includes(YES) ? 'Já' : 'Nei',
            }),
            buildSubmitField({
              id: 'estateWithNoProperty.submit',
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
