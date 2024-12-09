import {
  buildDescriptionField,
  buildForm,
  buildMultiField,
  buildRadioField,
  buildSection,
  getValueViaPath,
} from '@island.is/application/core'
import { Form, FormModes, Section } from '@island.is/application/types'
import { confirmation, externalData, payment } from '../../lib/messages'
import { InformationSection } from './InformationSection'
import { PersonalSection } from './PersonalSection'
import { ReviewSection } from './ReviewSection'
import { ChildrenSupportingDocumentsSection } from './ChildrenSupportingDocuments'
import { Logo } from '../../assets/Logo'
import { MAX_CNT_APPLICANTS } from '../../shared'
import { SupportingDocumentsSection } from './SupportingDocumentsSection'
import { buildFormPaymentChargeOverviewSection } from '@island.is/application/ui-forms'
import { getChargeItems } from '../../utils'

const buildSupportingDocumentsSections = (): Section[] => {
  return [...Array(MAX_CNT_APPLICANTS)].map((_key, index) => {
    return ChildrenSupportingDocumentsSection(index)
  })
}

export const CitizenshipForm: Form = buildForm({
  id: 'CitizenshipFormDraft',
  title: '',
  logo: Logo,
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    buildSection({
      id: 'externalData',
      title: externalData.dataProvider.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'NeverGetToMe',
      title: 'Never get to me',
      condition: (_answers) => false,
      children: [
        buildDescriptionField({
          id: `neverBeGottenTo`,
          title: 'I should never be gotten to',
          titleVariant: 'h5',
        }),
      ],
    }),
    PersonalSection,
    buildSection({
      id: 'MultiSection',
      title: 'Answer test',
      children: [
        buildMultiField({
          id: 'blabla',
          title: 'Mega title',
          description: 'something',
          children: [
            buildDescriptionField({
              id: `huehuehue`,
              title: 'Answer me',
              titleVariant: 'h5',
            }),
            buildRadioField({
              id: 'somethingToBeAnswered',
              title: '',
              backgroundColor: 'blue',
              width: 'half',
              required: true,
              options: [
                { value: 'yes', label: 'Ye' },
                { value: 'no', label: 'Naw' },
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'OnlyWhenYesWasAnswered',
      title: 'OnlyWhenYes',
      condition: (formValue) =>
        getValueViaPath(formValue, 'somethingToBeAnswered') === 'yes',
      children: [
        buildDescriptionField({
          id: `haha`,
          title: 'Answered!!!!',
          titleVariant: 'h5',
        }),
      ],
    }),
    InformationSection,
    SupportingDocumentsSection,
    ...buildSupportingDocumentsSections(),
    ReviewSection,
    buildFormPaymentChargeOverviewSection({
      sectionTitle: payment.general.sectionTitle,
      getSelectedChargeItems: (_) =>
        getChargeItems().map((item) => ({
          chargeItemCode: item.code,
          chargeItemQuantity: item.quantity,
        })),
    }),
    buildSection({
      id: 'confirmation',
      title: confirmation.general.sectionTitle,
      children: [],
    }),
  ],
})
