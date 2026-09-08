import { PageBuilder, type SectionBuilder } from '@island.is/application/core'

const createAccordionItemFields = (builderFn: (page: PageBuilder) => void) => {
  const page = new PageBuilder('accordionItemFields', '')
  builderFn(page)
  return page.getFields()
}

export const addAccordionSubsection = (
  section: SectionBuilder,
): SectionBuilder =>
  section.addSubSection('accordionSection', 'Accordion', (subSection) => {
    subSection.addPage(
      'accordionMultiField',
      'Accordion with input fields',
      (page) => {
        page
          .setDescription(
            'Accordion items can contain static text, interactive form fields, or both.',
          )
          .addDescriptionField('accordionSectionDescription', '', {
            description:
              'Take care when using fields within an accordion item, as they are not visible outside the expanded item. This can create poor UX.',
            marginBottom: 4,
          })
          .addDescriptionField('accordionSectionDescription2', '', {
            description:
              'A good use case for accordions with fields is when everything is optional and users only need to open some items, for example while editing or updating existing data.',
            marginBottom: 4,
          })
          .addAccordionField('accordionDemo', 'Accordion demo', {
            accordionItems: [
              {
                itemTitle: 'Text only',
                itemContent:
                  'This accordion item uses the text-only format. It renders as Markdown and supports **bold**, *italic*, and other formatting.',
              },
              {
                itemTitle: 'With input fields',
                children: createAccordionItemFields((item) => {
                  item
                    .addTextField('accordionTextField', 'Full name', {
                      placeholder: 'Enter your full name',
                    })
                    .addTextField('accordionEmailField', 'Email', {
                      placeholder: 'Enter your email',
                      variant: 'email',
                      width: 'half',
                    })
                    .addSelectField(
                      'accordionSelectField',
                      'Preferred language',
                      {
                        width: 'half',
                        options: [
                          { value: 'is', label: 'Íslenska' },
                          { value: 'en', label: 'English' },
                        ],
                      },
                    )
                }),
              },
              {
                itemTitle: 'Mixed content',
                itemContent:
                  'Read the following carefully, then fill in the fields below:',
                children: createAccordionItemFields((item) => {
                  item
                    .addCheckboxField('accordionCheckboxField', '', {
                      options: [
                        {
                          value: 'agree',
                          label: 'I have read and agree to the terms',
                        },
                      ],
                    })
                    .addRadioField(
                      'accordionRadioField',
                      'Contact preference',
                      {
                        options: [
                          { value: 'email', label: 'Email' },
                          { value: 'phone', label: 'Phone' },
                          { value: 'mail', label: 'Mail' },
                        ],
                      },
                    )
                }),
              },
              {
                itemTitle: 'With table repeater',
                children: createAccordionItemFields((item) => {
                  item.addTableRepeaterField('accordionTableRepeater', '', {
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
                  })
                }),
              },
              {
                itemTitle: 'With fields repeater',
                children: createAccordionItemFields((item) => {
                  item.addFieldsRepeaterField('accordionFieldsRepeater', '', {
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
                  })
                }),
              },
            ],
          })
      },
    )
  })
