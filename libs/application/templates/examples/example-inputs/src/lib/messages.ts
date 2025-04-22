import { defineMessages } from 'react-intl'

export const m = defineMessages({
  customComponentDescription: {
    id: 'exi.application:customComponentDescription',
    defaultMessage:
      'Before you make a custom component, go through this list to determine if you really need a custom component. A custom component should be the last option you go for when building an application.',
    description: 'Rules for custom components',
  },
  customComponentNumberedList: {
    id: 'exi.application:customComponentNumberedList#markdown',
    defaultMessage:
      '1. Try to use the shared components, such as `buildTextField`, `buildCheckboxField`, `buildSelectField`, `buildFileUploadField`, and others. This approach ensures a more consistent and uniform look and feel for the application.\\n\\n - If the shared components almost fulfill your needs but require slight adjustments, consult with the designer of the application to explore adapting the design to the built-in components.\\n\\n - If the design cannot be adjusted to the built-in components, consult Norda to determine if the shared components can be modified or expanded to meet your requirements.\\n\\n - Check if another application has created a similar custom component before. If so, it should be made into a shared component.\\n\\n - If you still need a new component, evaluate whether it is something that other applications might need in the future. If so, make the new component shared.\\n\\n - Create a custom component only if none of the above conditions apply.',
    description: 'Rules for custom components',
  },
  customComponentAbout: {
    id: 'exi.application:customComponentAbout',
    defaultMessage:
      'Custom components are just regular React components. They can take in some data you specify in the template and they have access to the application object. They can also be styled with vanilla-extract.',
    description: 'About custom components',
  },
  overviewTitle: {
    id: 'exi.application:overviewTitle',
    defaultMessage: 'Overview',
    description: 'Overview title',
  },
  overviewDescriptionText: {
    id: 'exi.application:overviewDescriptionText',
    defaultMessage:
      'The overview section is made up of buildOverviewFields, each one is a block with an edit button. The best organization for this screen is that each buildOverviewField has values corresponding to one screen.',
    description: 'Overview description',
  },
  overviewInfoDescripton: {
    id: 'exi.application:overviewInfoDescripton',
    defaultMessage:
      'Everything is built around key-value pairs. The Key is bold by default and the value is regular. The key can be made bold by setting the boldValueText property to true. Width can be controled for each key-value pair and can be set to "full", "half" or "snug". Note that the "snug" width can sneak up to the previous line, but that can be mitigated with an empty key-value pair, with width:"full".',
    description: 'Overview description for the info section',
  },
  overviewFileDescription: {
    id: 'exi.application:overviewFileDescription',
    defaultMessage:
      'The file overview can have width "full" or "half". The file name is the only required property.',
    description: 'Overview description for the file section',
  },
  overviewDescription: {
    id: 'exi.application:overviewDescription',
    defaultMessage:
      'At the moment the form overview is a custom component. The plan is to make this a shared component in the near future.',
    description: 'Overview description',
  },
  overviewSubmit: {
    id: 'exi.application:overviewSubmit',
    defaultMessage: 'Submit',
    description: 'Overview submit button',
  },
  number1: {
    id: 'exi.application:number1',
    defaultMessage: 'Number 1',
    description: 'key for number 1',
  },
})
