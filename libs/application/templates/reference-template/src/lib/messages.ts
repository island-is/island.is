import { defineMessages } from 'react-intl'

export const m = defineMessages({
  conditionsSection: {
    id: 'example.application:conditions.section',
    defaultMessage: 'Conditions',
    description: 'Some description',
  },
  institutionName: {
    id: 'example.application:institution.name',
    defaultMessage: 'Institution reference',
    description: `Institution's name`,
  },
  name: {
    id: 'example.application:name',
    defaultMessage: 'Application',
    description: `Application's name`,
  },
  nameApplicationWithValue: {
    id: 'example.application:name.application.with.value',
    defaultMessage: 'Application {value}',
    description: `Application's name with value`,
  },
  draftTitle: {
    id: 'example.application:draft.title',
    defaultMessage: 'Draft',
    description: 'First state title',
  },
  draftDescription: {
    id: 'example.application:draft.description',
    defaultMessage: 'Users have nothing to do at this stage',
    description: 'Description of the state',
  },
  introSection: {
    id: 'example.application:intro.section',
    defaultMessage: 'Information',
    description: 'Some description',
  },
  introTitle: {
    id: 'example.application:intro.title',
    defaultMessage: 'Welcome',
    description: 'Some description',
  },
  introDescription: {
    id: 'example.application:intro.description',
    defaultMessage:
      'This application shows how to build an application and what components are available. Each application is split into a few different forms that are loaded depending on the application state and/or the user role. Right now the application is showing the "exampleForm" and the application state is "draft". This means that you got through the first form "prerequisitesForm" where the state was "prerequisites".',
    description: 'Some description',
  },
  introDescription2: {
    id: 'example.application:intro.description2',
    defaultMessage:
      'This form covers all possible components that the application system offers and they are shown with different settings that results in the components appearing or behaving in different ways.',
    description: 'Some description',
  },
  about: {
    id: 'example.application:about',
    defaultMessage: 'About you',
    description: 'Some description',
  },
  personName: {
    id: 'example.application:person.name',
    defaultMessage: 'Name',
    description: 'Some description',
  },
  nationalId: {
    id: 'example.application:person.nationalId',
    defaultMessage: 'National ID',
    description: 'Some description',
  },
  age: {
    id: 'example.application:person.age',
    defaultMessage: 'Age',
    description: 'Some description',
  },
  email: {
    id: 'example.application:person.email',
    defaultMessage: 'Email',
    description: 'Some description',
  },
  phoneNumber: {
    id: 'example.application:person.phoneNumber',
    defaultMessage: 'Phone number',
    description: 'Some description',
  },
  assigneeTitle: {
    id: 'example.application:assigneeTitle',
    defaultMessage: 'Who should review?',
    description: 'Some description',
  },
  assignee: {
    id: 'example.application:assignee',
    defaultMessage: 'Assignee email',
    description: 'Some description',
  },
  yesOptionLabel: {
    id: 'example.application:yes.option.label',
    defaultMessage: 'Yes',
    description: 'Some description',
  },
  noOptionLabel: {
    id: 'example.application:no.option.label',
    defaultMessage: 'No',
    description: 'Some description',
  },
  governmentOptionLabel: {
    id: 'example.application:government.option.label',
    defaultMessage: 'The government',
    description: 'Some description',
  },
  outroMessage: {
    id: 'example.application:outro.message',
    defaultMessage:
      'Your application #{id} is now in review. The ID of the application is returned by the createApplication API action and read from application.externalData',
    description: 'Some description',
  },
  dataSchemePhoneNumber: {
    id: 'example.application:dataSchema.phoneNumber',
    defaultMessage: 'Phone number must be valid.',
    description: 'Error message when phone number is invalid.',
  },
  dataSchemeNationalId: {
    id: 'example.application:dataSchema.national.id',
    defaultMessage: 'National ID must be valid.',
    description: 'Error message when the kennitala is invalid.',
  },
  approvedByReviewerError: {
    id: 'example.application:approvedByReviewerError',
    defaultMessage:
      'Please indicate whether the application is approved or not',
    description: 'Some description',
  },
  regularTextExample: {
    id: 'example.application:regularTextExample',
    defaultMessage:
      'Regular text coming from a message file, this can be overwritten in contentful by webmaster',
    description: 'Example use of messages',
  },
  markdownHeadingExample: {
    id: 'example.application:markdownHeadingExample#markdown',
    defaultMessage:
      '# Markdown heading 1\\n\\n ## Markdown heading 2\\n\\n ### Markdown heading 3\\n\\n #### Markdown heading 4\\n\\n Regular markdown text',
    description: 'Example use of markdown',
  },
  markdownBulletListExample: {
    id: 'example.application:markdownBulletListExample#markdown',
    defaultMessage:
      'Markdown bullet list\\n\\n * bullet 1\\n\\n * bullet 2\\n\\n * bullet 3',
    description: 'Example use of markdown',
  },
  markdownNumberedListExample: {
    id: 'example.application:markdownNumberedListExample#markdown',
    defaultMessage:
      'Markdown numbered list\\n\\n 1. number 1\\n\\n 2. number 2\\n\\n 3. number 3',
    description: 'Example use of markdown',
  },
  markdownMiscExample: {
    id: 'example.application:markdownMiscExample#markdown',
    defaultMessage:
      'A markdown link will open in a new tab: [This is a link to Google!](http://google.com)\\n\\n Markdown value inserted {value1}\\n\\n **Bold text**\\n\\n *Italic text*\\n\\n ***Bold and italic text***',
    description: 'Example use of markdown link',
  },
  markdownCodeExample: {
    id: 'example.application:markdownCodeExample#markdown',
    defaultMessage:
      'Markdown code inline `const x = 123` with text Code block ``` const x = 123\\n\\n if (x < 100) {\\n\\n return true\\n\\n }```',
    description: 'Example use of markdown code',
  },
  customComponentDescription: {
    id: 'example.application:customComponentDescription',
    defaultMessage:
      'Before you make a custom component, go through this list to determine if you really need a custom component. A custom component should be the last option you go for when building an application.',
    description: 'Rules for custom components',
  },
  customComponentNumberedList: {
    id: 'example.application:customComponentDescription#markdown',
    defaultMessage:
      '1. Try to use the shared components, such as `buildTextField`, `buildCheckboxField`, `buildSelectField`, `buildFileUploadField`, and others. This approach ensures a more consistent and uniform look and feel for the application.\\n\\n - If the shared components almost fulfill your needs but require slight adjustments, consult with the designer of the application to explore adapting the design to the built-in components.\\n\\n - If the design cannot be adjusted to the built-in components, consult Norda to determine if the shared components can be modified or expanded to meet your requirements.\\n\\n - Check if another application has created a similar custom component before. If so, it should be made into a shared component.\\n\\n - If you still need a new component, evaluate whether it is something that other applications might need in the future. If so, make the new component shared.\\n\\n - Create a custom component only if none of the above conditions apply.',
    description: 'Rules for custom components',
  },
  customComponentAbout: {
    id: 'example.application:customComponentAbout',
    defaultMessage:
      'Custom components are just regular React components. They can take in some data you specify in the template and they have access to the application object. They can also be styled with vanilla-extract.',
    description: 'About custom components',
  },
  overviewTitle: {
    id: 'example.application:overviewTitle',
    defaultMessage: 'Overview',
    description: 'Overview title',
  },
  overviewDescriptionText: {
    id: 'example.application:overviewDescriptionText',
    defaultMessage:
      'The overview section is made up of buildOverviewFields, each one is a block with an edit button. The best organization for this screen is that each buildOverviewField has values corresponding to one screen.',
    description: 'Overview description',
  },
  overviewInfoDescripton: {
    id: 'example.application:overviewInfoDescripton',
    defaultMessage:
      'Everything is built around key-value pairs. The Key is bold by default and the value is regular. The key can be made bold by setting the boldValueText property to true. Width can be controled for each key-value pair and can be set to "full", "half" or "snug". Note that the "snug" width can sneak up to the previous line, but that can be mitigated with an empty key-value pair, with width:"full".',
    description: 'Overview description for the info section',
  },
  overviewFileDescription: {
    id: 'example.application:overviewFileDescription',
    defaultMessage:
      'The file overview can have width "full" or "half". The file name is the only required property.',
    description: 'Overview description for the file section',
  },
  overviewDescription: {
    id: 'example.application:overviewDescription',
    defaultMessage:
      'At the moment the form overview is a custom component. The plan is to make this a shared component in the near future.',
    description: 'Overview description',
  },
  overviewSubmit: {
    id: 'example.application:overviewSubmit',
    defaultMessage: 'Submit',
    description: 'Overview submit button',
  },
  validationDescription: {
    id: 'example.application:validation.description#markdown',
    defaultMessage:
      'Any field can have the value `required: true`, which uses the built-in functionality of `html` and can be disabled by inspecting the DOM for the page.\n\n Generally, it is best to put everything that needs to be filled out or needs to be filled out in a certain way in `/lib/dataSchema.ts`. For validation, use *zod*.',
    description: 'Validation description',
  },
  validationDescription3: {
    id: 'example.application:validation.description3#markdown',
    defaultMessage:
      'If the options in a field are all in one `enum`, then use `z.nativeEnum()` in zod validation to skip listing all the options in the enum as is required when using `z.enum()`.',
    description: 'Validation description',
  },
  conditionsDescription2: {
    id: 'example.application:conditions.description2#markdown',
    defaultMessage:
      'This is done in the same way in both cases. Everything should be able to take in `condition` as a parameter and condition takes in a function `(answers, externalData) => { ... }` that returns `true` or `false`.',
    description: 'Validation description',
  },
  descriptionFieldDescription: {
    id: 'example.application:descriptionFieldDescription',
    defaultMessage:
      'All text that appears in applications should come from `lib/messages.ts`. This text is then loaded into contentful by running `yarn nx run <template-name>:extract-strings`, where `<template-name>` is the name of the application as it is written in `project.json` in the relevant template. For this application it is `yarn nx run application-templates-reference-template:extract-strings`. In contentful, the content manager or administrator of the organization is responsible for adding English translations and updating the text from what the developer puts in `defaultMessage`.',
    description: 'Description field description',
  },
  descriptionFieldDescription2: {
    id: 'example.application:descriptionFieldDescription2',
    defaultMessage:
      'Here is a list of all the options for text from buildDescriptionField. Most of them are related to adding `#markdown` to the id to be able to use markdown in the text. It is also possible to put variables into the text and control title font sizes. Please note that any linebreaks in the text must be represented as two escaped newlines. See the `messages.ts` file for examples of how to use markdown in the text.',
    description: 'Description field description',
  },
  number1: {
    id: 'example.application:number1',
    defaultMessage: 'Number 1',
    description: 'key for number 1',
  },
})
