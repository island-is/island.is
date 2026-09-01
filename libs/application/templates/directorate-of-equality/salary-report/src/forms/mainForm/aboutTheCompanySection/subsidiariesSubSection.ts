import {
  buildCustomField,
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildSubSection,
  buildTableRepeaterField,
  getValueViaPath,
  YES,
  NO,
} from '@island.is/application/core'
import { messages } from '../../../lib/messages'

export const subsidiariesSubSection = buildSubSection({
  id: 'subsidiaries',
  title: messages.aboutTheCompany.subsidiaries.sectionTitle,
  children: [
    buildMultiField({
      id: 'subsidiariesMultiField',
      title: messages.aboutTheCompany.subsidiaries.title,
      description: messages.aboutTheCompany.subsidiaries.intro,
      children: [
        buildDescriptionField({
          id: 'subsidiaries.includesSubsidiariesTitle',
          title:
            messages.aboutTheCompany.subsidiaries.includesSubsidiariesTitle,
          titleVariant: 'h4',
        }),
        buildRadioField({
          id: 'subsidiaries.includesSubsidiaries',
          largeButtons: true,
          width: 'half',
          required: true,
          // Clears stray rows so 'no' can't leave one behind unvalidated.
          clearOnChange: ['subsidiaries.list'],
          clearOnChangeDefaultValue: [],
          options: [
            {
              value: YES,
              label: messages.aboutTheCompany.subsidiaries.yes,
            },
            { value: NO, label: messages.aboutTheCompany.subsidiaries.no },
          ],
        }),
        buildTableRepeaterField({
          id: 'subsidiaries.list',
          marginTop: 0,
          formTitle: messages.aboutTheCompany.subsidiaries.tableFormTitle,
          addItemButtonText:
            messages.aboutTheCompany.subsidiaries.tableAddButton,
          saveItemButtonText:
            messages.aboutTheCompany.subsidiaries.tableSaveButton,
          removeButtonTooltipText:
            messages.aboutTheCompany.subsidiaries.tableRemoveButton,
          editButtonTooltipText:
            messages.aboutTheCompany.subsidiaries.tableEditButton,
          editField: true,
          fields: {
            nationalIdWithName: {
              component: 'nationalIdWithName',
              searchCompanies: true,
              customNationalIdLabel:
                messages.aboutTheCompany.subsidiaries.tableHeaderNationalId,
              customNameLabel:
                messages.aboutTheCompany.subsidiaries.tableHeaderName,
            },
          },
          table: {
            header: [
              messages.aboutTheCompany.subsidiaries.tableHeaderName,
              messages.aboutTheCompany.subsidiaries.tableHeaderNationalId,
            ],
            rows: ['name', 'nationalId'],
          },
          condition: (answers) =>
            getValueViaPath(answers, 'subsidiaries.includesSubsidiaries') ===
            YES,
        }),
        buildCustomField({
          // Not an answer path: registers no input, only clears the guard above.
          id: 'subsidiaries.formGuard',
          title: '',
          component: 'SubsidiariesFormGuard',
          doesNotRequireAnswer: true,
        }),
      ],
    }),
  ],
})
