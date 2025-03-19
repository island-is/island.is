import { defineMessages } from 'react-intl'

export const m = defineMessages({
  descriptionFieldDescription: {
    id: 'eni.application:descriptionFieldDescription',
    defaultMessage:
      'All text that appears in applications should come from `lib/messages.ts`. This text is then loaded into contentful by running `yarn nx run <template-name>:extract-strings`, where `<template-name>` is the name of the application as it is written in `project.json` in the relevant template. For this application it is `yarn nx run application-templates-reference-template:extract-strings`. In contentful, the content manager or administrator of the organization is responsible for adding English translations and updating the text from what the developer puts in `defaultMessage`.',
    description: 'Description field description',
  },
  descriptionFieldDescription2: {
    id: 'eni.application:descriptionFieldDescription2',
    defaultMessage:
      'Here is a list of all the options for text from buildDescriptionField. Most of them are related to adding `#markdown` to the id to be able to use markdown in the text. It is also possible to put variables into the text and control title font sizes. Please note that any linebreaks in the text must be represented as two escaped newlines. See the `messages.ts` file for examples of how to use markdown in the text.',
    description: 'Description field description',
  },
  regularTextExample: {
    id: 'eni.application:regularTextExample',
    defaultMessage:
      'Regular text coming from a message file, this can be overwritten in contentful by webmaster',
    description: 'Example use of messages',
  },
  markdownHeadingExample: {
    id: 'eni.application:markdownHeadingExample#markdown',
    defaultMessage:
      '# Markdown heading 1\\n\\n ## Markdown heading 2\\n\\n ### Markdown heading 3\\n\\n #### Markdown heading 4\\n\\n Regular markdown text',
    description: 'Example use of markdown',
  },
  markdownBulletListExample: {
    id: 'eni.application:markdownBulletListExample#markdown',
    defaultMessage:
      'Markdown bullet list\\n\\n * bullet 1\\n\\n * bullet 2\\n\\n * bullet 3',
    description: 'Example use of markdown',
  },
  markdownNumberedListExample: {
    id: 'eni.application:markdownNumberedListExample#markdown',
    defaultMessage:
      'Markdown numbered list\\n\\n 1. number 1\\n\\n 2. number 2\\n\\n 3. number 3',
    description: 'Example use of markdown',
  },
  markdownMiscExample: {
    id: 'eni.application:markdownMiscExample#markdown',
    defaultMessage:
      'A markdown link will open in a new tab: [This is a link to Google!](http://google.com)\\n\\n Markdown value inserted {value1}\\n\\n **Bold text**\\n\\n *Italic text*\\n\\n ***Bold and italic text***',
    description: 'Example use of markdown link',
  },
  markdownCodeExample: {
    id: 'eni.application:markdownCodeExample#markdown',
    defaultMessage:
      'Markdown code inline `const x = 123` with text Code block ``` const x = 123\\n\\n if (x < 100) {\\n\\n return true\\n\\n }```',
    description: 'Example use of markdown code',
  },
  overviewTitle: {
    id: 'eni.application:overviewTitle',
    defaultMessage: 'Overview',
    description: 'Overview title',
  },
  overviewDescriptionText: {
    id: 'eni.application:overviewDescriptionText',
    defaultMessage:
      'The overview section is made up of buildOverviewFields, each one is a block with an edit button. The best organization for this screen is that each buildOverviewField has values corresponding to one screen.',
    description: 'Overview description',
  },
  overviewInfoDescripton2: {
    id: 'eni.application:overviewInfoDescripton2',
    defaultMessage:
      'See more examples using the buildOverviewField in the example-inputs template.',
    description: 'Overview description for the info section',
  },
  overviewFileDescription: {
    id: 'eni.application:overviewFileDescription',
    defaultMessage:
      'The file overview can have width "full" or "half". The file name is the only required property.',
    description: 'Overview description for the file section',
  },
  overviewDescription: {
    id: 'eni.application:overviewDescription',
    defaultMessage:
      'At the moment the form overview is a custom component. The plan is to make this a shared component in the near future.',
    description: 'Overview description',
  },
  overviewSubmit: {
    id: 'eni.application:overviewSubmit',
    defaultMessage: 'Submit',
    description: 'Overview submit button',
  },
  number1: {
    id: 'eni.application:number1',
    defaultMessage: 'Number 1',
    description: 'key for number 1',
  },
})
