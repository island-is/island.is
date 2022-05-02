import {
  buildForm,
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildSubmitField,
  buildSubSection,
  buildTextField,
  Form,
  FormModes,
  buildFileUploadField,
  buildExternalDataProvider,
  buildDataProviderItem,
} from '@island.is/application/core'
import { ApiActions } from '../shared'
import { m } from '../lib/messages'

export const Application: Form = buildForm({
  id: 'FinancialStatement',
  title: '',
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'conditions',
      title: m.dataCollectionTitle,
      children: [
        buildExternalDataProvider({
          id: 'approveExternalData',
          title: m.dataCollectionTitle,
          checkboxLabel: m.dataCollectionCheckboxLabel,
          dataProviders: [
            buildDataProviderItem({
              id: 'sampleData',
              type: 'SampleDataProvider',
              title: '',
              subTitle: m.fundInfo
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'info',
      title: m.infoSection,
      children: [
        buildMultiField({
          id: 'about',
          title: m.about,
          children: [
            buildTextField({
              id: 'about.email',
              title: m.email,
              width: 'half',
            }),
            buildTextField({
              id: 'about.phoneNumber',
              title: m.phoneNumber,
              width: 'half',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'keyNumbers',
      title: m.keyNumbers,
      children: [
        buildSubSection({
          id: 'properties',
          title: m.properties,
          children: [
            buildMultiField({
              title: '',
              children: [
                buildTextField({
                  id: 'properties.short',
                  title: m.propertiesShort,
                  width: 'half',
                }),
                buildTextField({
                  id: 'properties.cash',
                  title: m.propertiesCash,
                  width: 'half',
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'income',
          title: m.income,
          children: [
            buildMultiField({
              title: '',
              children: [
                buildTextField({
                  id: 'income.donations',
                  title: m.donations,
                  width: 'half',
                }),
                buildTextField({
                  id: 'income.personal',
                  title: m.personalIncome,
                  width: 'half',
                }),
                buildTextField({
                  id: 'income.capital',
                  title: m.capitalIncome,
                  width: 'half',
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'documents',
      title: m.financialStatement,
      children: [
        buildFileUploadField({
          id: 'attachment',
          title: m.upload,
          introduction: m.uploadIntro,
          description: m.uploadDescription,
          uploadMultiple: false,
          doesNotRequireAnswer: true,
        }),
      ]
    }),
    buildSection({
      id: 'confirmation',
      title: m.confirm,
      children: [
        buildMultiField({
          title: '',
          children: [
            buildDescriptionField({
              id: 'overview',
              title: m.overviewSectionTitle,
              description:
                m.overviewSectionDescription,
            }),
            buildSubmitField({
              id: 'submit',
              placement: 'screen',
              title: m.send,
              actions: [
                { event: 'SUBMIT', name: m.send, type: 'primary' },
              ],
            }),
          ],
        }),
        buildDescriptionField({
          id: 'final',
          title: m.thankYou,
          description: (application) => {
            const sendApplicationActionResult =
              application.externalData[ApiActions.createApplication]

            let id = 'unknown'
            if (sendApplicationActionResult) {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              id = sendApplicationActionResult.data.id
            }

            return {
              ...m.outroMessage,
              values: {
                id,
              },
            }
          },
        }),
      ],
    }),
  ],
})
