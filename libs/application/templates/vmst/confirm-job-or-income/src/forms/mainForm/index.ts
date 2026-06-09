import {
  buildForm,
  buildSection,
  buildSubmitField,
  buildDescriptionField,
  buildMultiField,
  buildSelectField,
} from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { DirectorateOfLabourLogo } from '@island.is/application/assets/institution-logos'
import * as m from '../../lib/messages'
import { casualWorkFields } from '../../fields/casualWorkFields'
import { partTimeFields } from '../../fields/partTimeFields'
import { contractWorkFields } from '../../fields/contractWorkFields'
import { pensionFields } from '../../fields/pensionFields'
import { capitalIncomeFields } from '../../fields/capitalIncomeFields'
import { socialInsuranceFields } from '../../fields/socialInsuranceFields'

export const MainForm = buildForm({
  id: 'MainForm',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  logo: DirectorateOfLabourLogo,
  children: [
    buildSection({
      id: 'incomeSection',
      title: m.application.incomeSectionTitle,
      children: [
        buildMultiField({
          id: 'incomeType',
          title: m.application.pageTitle,
          children: [
            buildDescriptionField({
              id: 'incomeTypeDescription',
              description: m.application.pageDescription,
            }),
            buildDescriptionField({
              id: 'incomeTypePageInfo',
              title: m.application.pageInfo,
              titleVariant: 'h5',
            }),
            buildSelectField({
              id: 'typeOfIncome',
              title: m.application.incomeTypeTitle,
              required: true,
              setOnChange: async () => {
                return [
                  { key: 'registerCasualWork', value: undefined },
                  { key: 'registerPartTime', value: undefined },
                  { key: 'registerContractWork', value: undefined },
                  { key: 'registerCapitalIncome', value: undefined },
                  { key: 'registerSocialInsurance', value: undefined },
                  { key: 'registerPension', value: undefined },
                ]
              },
              options: [
                {
                  value: 'casualWork',
                  label: m.application.incomeTypeCasualWork,
                },
                { value: 'partTime', label: m.application.incomeTypePartTime },
                {
                  value: 'contractWork',
                  label: m.application.incomeTypeContractWork,
                },
                { value: 'pension', label: m.application.incomeTypePension },
                {
                  value: 'capitalIncome',
                  label: m.application.incomeTypeCapitalIncome,
                },
                {
                  value: 'socialInsurance',
                  label: m.application.incomeTypeSocialInsurance,
                },
              ],
            }),

            ...casualWorkFields,
            ...partTimeFields,
            ...contractWorkFields,
            ...pensionFields,
            ...capitalIncomeFields,
            ...socialInsuranceFields,

            buildSubmitField({
              id: 'submit',
              title: m.application.submitButton,
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  event: 'SUBMIT',
                  name: m.application.submitButton,
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
