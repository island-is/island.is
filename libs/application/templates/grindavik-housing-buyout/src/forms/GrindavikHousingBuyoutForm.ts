import {
  buildDescriptionField,
  buildForm,
  buildMultiField,
  buildSection,
  buildStaticTableField,
  buildSubmitField,
  buildTableRepeaterField,
  buildTextField,
} from '@island.is/application/core'
import {
  Form,
  FormModes,
  NationalRegistryIndividual,
} from '@island.is/application/types'
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
            buildStaticTableField({
              title: 'Vesturhóp 34, 240 Grindavík',
              header: [
                'Þinglýstir eigendur',
                'Kennitala',
                'Heimild',
                'Eignarhlutfall',
                'Brunabótamat',
              ],
              rows: (application) => {
                const data = application.externalData.nationalRegistry
                  .data as NationalRegistryIndividual

                return [
                  [
                    data.fullName,
                    data.nationalId,
                    'Íbúð',
                    '100%',
                    formatCurrency('84500000'),
                  ],
                ]
              },
              summary: (_application) => {
                return {
                  label: 'Kaupverð 95% af brunabótamati',
                  value: formatCurrency('80275000'),
                }
              },
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'loanStatusSection',
      title: m.application.loanStatus.sectionTitle,
      children: [
        buildTableRepeaterField({
          id: 'loans',
          marginTop: 2,
          title: m.application.loanStatus.sectionTitle,
          description: m.application.loanStatus.sectionDescription,
          addItemButtonText: m.application.loanStatus.addNewLoan,
          saveItemButtonText: m.application.loanStatus.saveNewLoan,
          getStaticTableData: (_application) => {
            // TODO: Loan data from data provider
            console.log(_application)
            return [{ status: '1450000', provider: 'Bingo' }]
          },
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
