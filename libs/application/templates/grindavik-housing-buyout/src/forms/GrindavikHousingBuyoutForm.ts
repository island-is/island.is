import {
  buildDescriptionField,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubmitField,
  buildTableRepeaterField,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import {
  applicantInformationMultiField,
  buildFormConclusionSection,
} from '@island.is/application/ui-forms'
import * as m from '../lib/messages'
import { formatCurrency } from '@island.is/application/ui-components'

export const GrindavikHousingBuyoutForm: Form = buildForm({
  id: 'GrindavikHousingBuyoutDraft',
  title: m.application.general.name,
  mode: FormModes.DRAFT,
  children: [
    buildSection({
      id: 'applicantInfoSection',
      title: m.application.applicant.sectionTitle,
      children: [applicantInformationMultiField()],
    }),
    buildSection({
      id: 'propertyInformationSection',
      title: m.application.propertyInformation.sectionTitle,
      children: [
        buildMultiField({
          id: 'propertyInformationMultiField',
          title: m.application.propertyInformation.sectionTitle,
          description: m.application.propertyInformation.sectionDescription,
          children: [
            buildDescriptionField({
              id: 'test',
              title: '',
              description: 'Here be dragons',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'loanStatusSection',
      title: m.application.loanStatus.sectionTitle,
      children: [
        buildMultiField({
          id: 'loanStatusMultiField',
          title: m.application.loanStatus.sectionTitle,
          description: m.application.loanStatus.sectionDescription,
          children: [
            buildTableRepeaterField({
              id: 'loans',
              title: m.application.loanStatus.sectionTitle,
              addItemButtonText: m.application.loanStatus.addNewLoan,
              saveItemButtonText: m.application.loanStatus.saveNewLoan,
              fields: {
                status: {
                  component: 'input',
                  label: m.application.loanStatus.statusOfLoan,
                  currency: true,
                },
                provider: {
                  component: 'input',
                  label: m.application.loanStatus.loanProvider,
                },
              },
              table: {
                format: {
                  status: (v) => formatCurrency(v),
                },
              },
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'overview',
      title: m.application.overview.sectionTitle,
      children: [
        buildMultiField({
          id: 'overviewMultiField',
          title: m.application.overview.sectionTitle,
          description: m.application.overview.sectionDescription,
          children: [
            buildDescriptionField({
              id: 'test3',
              title: '',
              description: 'Here be OVERVIEW',
            }),
            buildSubmitField({
              id: 'submit',
              title: m.application.general.submit,
              placement: 'footer',
              actions: [
                {
                  event: 'SUBMIT',
                  name: m.application.general.submit,
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
      ],
    }),
    buildFormConclusionSection({}),
  ],
})
