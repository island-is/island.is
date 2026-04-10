import {
  buildAccordionField,
  buildCheckboxField,
  buildDescriptionField,
  buildFieldsRepeaterField,
  buildMultiField,
  buildRadioField,
  buildSection,
  buildSelectField,
  buildTableRepeaterField,
  buildTextField,
} from '@island.is/application/core'

export const accordionSection = buildSection({
  condition: (answers) => {
    console.log('answers: ', answers)
    return true
  },
  id: 'accordionSection',
  title: 'Accordion',
  children: [
    buildMultiField({
      id: 'accordionMultiField',
      title: 'Accordion with input fields',
      children: [
        buildDescriptionField({
          id: 'accordionSectionDescription',
          description:
            'Accordion items can contain static text, interactive form fields, or both.',
        }),
        buildAccordionField({
          id: 'accordionDemo',
          title: 'Accordion demo',
          accordionItems: [
            {
              itemTitle: 'Text only (backwards compatible)',
              itemContent:
                'This accordion item uses the original text-only format. It renders as Markdown and supports **bold**, *italic*, and other formatting.',
            },
            {
              itemTitle: 'With input fields',
              children: [
                buildTextField({
                  id: 'accordionTextField',
                  title: 'Full name',
                  placeholder: 'Enter your full name',
                }),
                buildTextField({
                  id: 'accordionEmailField',
                  title: 'Email',
                  placeholder: 'Enter your email',
                  variant: 'email',
                  width: 'half',
                }),
                buildSelectField({
                  id: 'accordionSelectField',
                  title: 'Preferred language',
                  width: 'half',
                  options: [
                    { value: 'is', label: 'Íslenska' },
                    { value: 'en', label: 'English' },
                  ],
                }),
              ],
            },
            {
              itemTitle: 'Mixed content',
              itemContent:
                'Read the following carefully, then fill in the fields below:',
              children: [
                buildCheckboxField({
                  id: 'accordionCheckboxField',
                  title: '',
                  options: [
                    {
                      value: 'agree',
                      label: 'I have read and agree to the terms',
                    },
                  ],
                }),
                buildRadioField({
                  id: 'accordionRadioField',
                  title: 'Contact preference',
                  options: [
                    { value: 'email', label: 'Email' },
                    { value: 'phone', label: 'Phone' },
                    { value: 'mail', label: 'Mail' },
                  ],
                }),
              ],
            },
            {
              itemTitle: 'With table repeater',
              children: [
                buildTableRepeaterField({
                  id: 'accordionTableRepeater',
                  title: '',
                  addItemButtonText: 'Add row',
                  saveItemButtonText: 'Save row',
                  removeButtonTooltipText: 'Remove',
                  editButtonTooltipText: 'Edit',
                  editField: true,
                  fields: {
                    name: {
                      component: 'input',
                      label: 'Name',
                      width: 'half',
                      type: 'text',
                    },
                    role: {
                      component: 'select',
                      label: 'Role',
                      width: 'half',
                      options: [
                        { label: 'Admin', value: 'admin' },
                        { label: 'Editor', value: 'editor' },
                        { label: 'Viewer', value: 'viewer' },
                      ],
                    },
                    email: {
                      component: 'input',
                      label: 'Email',
                      width: 'half',
                      type: 'email',
                    },
                  },
                  table: {
                    header: ['Name', 'Role', 'Email'],
                  },
                }),
              ],
            },
            {
              itemTitle: 'With fields repeater',
              children: [
                buildFieldsRepeaterField({
                  id: 'accordionFieldsRepeater',
                  title: '',
                  formTitle: 'Entry',
                  addItemButtonText: 'Add entry',
                  removeItemButtonText: 'Remove',
                  fields: {
                    description: {
                      component: 'input',
                      label: 'Description',
                      width: 'full',
                      type: 'text',
                    },
                    amount: {
                      component: 'input',
                      label: 'Amount',
                      width: 'half',
                      type: 'number',
                    },
                    date: {
                      component: 'date',
                      label: 'Date',
                      width: 'half',
                    },
                  },
                }),
              ],
            },
          ],
        }),
      ],
    }),
  ],
})
