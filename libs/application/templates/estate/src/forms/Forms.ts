import {
  buildCheckboxField,
  buildDescriptionField,
  buildDividerField,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents, Form, FormModes } from '@island.is/application/types'
import { dataCollection } from './Sections/dataCollection'
import { announcerInfo } from './Sections/announcerInfo'
import { deceasedSpouse } from './Sections/SpouseOfTheDeceased'
import { estateMembers } from './Sections/estateMembers'
import { testamentInfo } from './Sections/testamentInfo'
import { estateAssets } from './Sections/estateProperties'
import { estateDebts } from './Sections/estateDebts'
import { attachments } from './Sections/attachments'
import { representative } from './Sections/representative'
import { approvePrivateDivisionSubmission } from './Sections/approveSubmission'
import { overview } from './Overview/overview'
import { overviewPrivateDivision } from './Overview/privateOverviewSection'
import { estateWithoutAssets } from './Sections/estateWithoutAssets'
import { m } from '../lib/messages'
import { deceasedInfoFields } from './Sections/deceasedInfoFields'
import { YES } from '../lib/constants'

/* EINKASKIPTI */

export const privateDivisionForm: Form = buildForm({
  id: 'privateDivisionForm',
  title: '',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    dataCollection,
    announcerInfo,
    deceasedSpouse,
    estateMembers,
    testamentInfo,
    estateAssets,
    estateDebts,
    attachments,
    representative,
    approvePrivateDivisionSubmission,
    overviewPrivateDivision,
  ],
})

/* SETA Í ÓSKIPTU BÚI */

export const undividedEstateForm: Form = buildForm({
  id: 'undividedEstateForm',
  title: '',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    dataCollection,
    announcerInfo,
    estateMembers,
    testamentInfo,
    estateAssets,
    estateDebts,
    attachments,
    overview,
  ],
})

/* EIGNALAUST DÁNARBU */

export const estateWithoutAssetsForm: Form = buildForm({
  id: 'estateWithoutAssetsForm',
  title: '',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    dataCollection,
    announcerInfo,
    estateMembers,
    testamentInfo,
    estateWithoutAssets,
    estateAssets,
    estateDebts,
    attachments,
    overview,
  ],
})

export const officialDivisionForm: Form = buildForm({
  id: 'officialDivisionForm',
  title: '',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    dataCollection,
    announcerInfo,
    buildSection({
      id: 'overviewDivisionOfEstate',
      title: m.overviewTitle,
      children: [
        buildMultiField({
          id: 'overviewDivisionOfEstate',
          title: m.overviewTitle,
          description: m.overviewSubtitleDivisionOfEstate,
          children: [
            buildDividerField({}),
            buildDescriptionField({
              id: 'deceasedHeader',
              title: m.theDeceased,
              titleVariant: 'h3',
              marginBottom: 2,
              space: 'gutter',
            }),
            ...deceasedInfoFields,
            buildDescriptionField({
              id: 'space0',
              title: '',
              space: 'containerGutter',
            }),
            buildCheckboxField({
              id: 'confirmAction',
              title: '',
              large: true,
              backgroundColor: 'blue',
              defaultValue: [],
              options: [
                {
                  value: YES,
                  label: m.divisionOfEstateConfirmActionCheckbox.defaultMessage,
                },
              ],
            }),
            buildSubmitField({
              id: 'officialDivisionForm.submit',
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
