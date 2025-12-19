import {
  buildMultiField,
  buildRadioField,
  buildSection,
  YES,
  getValueViaPath,
  NO,
  buildNationalIdWithNameField,
  buildCustomField,
  YesOrNoEnum,
} from '@island.is/application/core'
import { m } from '../../lib/messages'

export const payerSection = buildSection({
  id: 'payerSection',
  title: m.payer.sectionTitle,
  children: [
    buildMultiField({
      id: 'payerSectionMultiField',
      title: m.payer.sectionTitle,
      children: [
        buildRadioField({
          id: 'userIsPayingAsIndividual',
          title: m.payer.userIsPayingAsIndividualLabel,
          defaultValue: YES,
          width: 'half',
          backgroundColor: 'white',
          options: [
            { label: m.payer.userIsPayingAsIndividualYesLabel, value: YES },
            { label: m.payer.userIsPayingAsIndividualNoLabel, value: NO },
          ],
        }),
        buildNationalIdWithNameField({
          marginTop: 4,
          id: 'companyPayment',
          title: m.payer.companyInfoTitle,
          titleVariant: 'h4',
          required: true,
          searchCompanies: true,
          searchPersons: false,
          condition: (answers) =>
            getValueViaPath<YesOrNoEnum>(
              answers,
              'userIsPayingAsIndividual',
              YesOrNoEnum.YES,
            ) === YesOrNoEnum.NO,
        }),
        buildCustomField({
          id: 'payerValidation',
          component: 'PayerValidation',
        }),
      ],
    }),
  ],
})
