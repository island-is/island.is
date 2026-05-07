import { defineMessages } from 'react-intl'

export const confirmation = defineMessages({
  sectionTitle: {
    id: 'vmst.cjs.confirmation:sectionTitle',
    defaultMessage: 'Staðfesta atvinnuleit',
    description: 'Title of the confirmation section and multi-field',
  },
  sectionStepTitle: {
    id: 'vmst.cjs.confirmation:sectionStepTitle',
    defaultMessage: 'Atvinnuleit',
    description: 'Section step title of the confirmation section',
  },
  multiFieldDescription: {
    id: 'vmst.cjs.confirmation:multiFieldDescription',
    defaultMessage:
      'Hér fyrir neðan geturðu skráð þau störf sem þú sóttir um í mánuðinum.',
    description: 'Description shown below the confirmation section title',
  },
  tableTitle: {
    id: 'vmst.cjs.confirmation:tableTitle',
    defaultMessage:
      'Ég hef sótt um vinnu á eftirfarandi stöðum frá síðustu staðfestingu:',
    description: 'Title above the job applications table',
  },
  companyNameLabel: {
    id: 'vmst.cjs.confirmation:companyNameLabel',
    defaultMessage: 'Nafn fyrirtækis',
    description: 'Label for the company name input in the table repeater',
  },
  addItemButtonText: {
    id: 'vmst.cjs.confirmation:addItemButtonText',
    defaultMessage: 'Skrá starf',
    description: 'Button text to add/save a new job entry',
  },
  saveItemButtonText: {
    id: 'vmst.cjs.confirmation:saveItemButtonText',
    defaultMessage: 'Vista starf',
    description: 'Button text to save an existing job entry',
  },
  removeButtonTooltipText: {
    id: 'vmst.cjs.confirmation:removeButtonTooltipText',
    defaultMessage: 'Fjarlægja',
    description: 'Tooltip on the remove button for each job entry row',
  },
})
