import { defineMessages } from 'react-intl'

export const m = defineMessages({
  conditionsSection: {
    id: 'example.application:conditions.section',
    defaultMessage: 'Skilyrði',
    description: 'Some description',
  },
  institutionName: {
    id: 'example.application.institution',
    defaultMessage: 'Institution reference',
    description: `Institution's name`,
  },
  name: {
    id: 'example.application:name',
    defaultMessage: 'Umsókn',
    description: `Application's name`,
  },
  nameApplicationNeverWorkedBefore: {
    id: 'example.application:name.application.never.worked.before',
    defaultMessage: 'Umsókn - Aldrei unnið áður',
    description: `Application's name`,
  },
  nameApplicationWithValue: {
    id: 'example.application:name.application.with.value',
    defaultMessage: 'Umsókn {value}',
    description: `Application's name with value`,
  },
  draftTitle: {
    id: 'example.application:draft.title',
    defaultMessage: 'Drög',
    description: 'First state title',
  },
  draftDescription: {
    id: 'example.application:draft.description',
    defaultMessage: 'Notendur hafa ekkert að gera á þessu stigi',
    description: 'Description of the state',
  },
  introSection: {
    id: 'example.application:intro.section',
    defaultMessage: 'Upplýsingar',
    description: 'Some description',
  },
  introField: {
    id: 'example.application:intro.field',
    defaultMessage: 'Velkomin(n)',
    description: 'Some description',
  },
  introIntroduction: {
    id: 'example.application:intro.introduction',
    defaultMessage:
      '*Hello*, **{name}**! [This is a link to Google!](http://google.com)',
    description: 'Some description',
  },
  about: {
    id: 'example.application:about',
    defaultMessage: 'Um þig',
    description: 'Some description',
  },
  personName: {
    id: 'example.application:person.name',
    defaultMessage: 'Nafn',
    description: 'Some description',
  },
  nationalId: {
    id: 'example.application:person.nationalId',
    defaultMessage: 'Kennitala',
    description: 'Some description',
  },
  age: {
    id: 'example.application:person.age',
    defaultMessage: 'Aldur',
    description: 'Some description',
  },
  email: {
    id: 'example.application:person.email',
    defaultMessage: 'Netfang',
    description: 'Some description',
  },
  phoneNumber: {
    id: 'example.application:person.phoneNumber',
    defaultMessage: 'Símanúmer',
    description: 'Some description',
  },
  career: {
    id: 'example.application:career',
    defaultMessage: 'Starfsferill',
    description: 'Some description',
  },
  history: {
    id: 'example.application:history',
    defaultMessage: 'Hvar hefur þú unnið áður?',
    description: 'Some description',
  },
  careerIndustry: {
    id: 'example.application:career.industry',
    defaultMessage: 'Starfsgeiri',
    description: 'Some description',
  },
  careerIndustryDescription: {
    id: 'example.application:career.industryDescription',
    defaultMessage: 'Í hvaða geira hefur þú unnið?',
    description: 'Some description',
  },
  careerHistory: {
    id: 'example.application:careerHistory',
    defaultMessage: 'Hefurðu unnið yfir höfuð einhvern tímann áður?',
    description: 'Some description',
  },
  careerHistoryCompanies: {
    id: 'example.application:careerHistoryCompanies',
    defaultMessage: 'Hefurðu unnið fyrir eftirfarandi aðila?',
    description: 'Some description',
  },
  future: {
    id: 'example.application:future',
    defaultMessage: 'Hvar langar þig að vinna?',
    description: 'Some description',
  },
  dreamJob: {
    id: 'example.application:dreamJob',
    defaultMessage: 'Einhver draumavinnustaður?',
    description: 'Some description',
  },
  assigneeTitle: {
    id: 'example.application:assigneeTitle',
    defaultMessage: 'Hver á að fara yfir?',
    description: 'Some description',
  },
  assignee: {
    id: 'example.application:assignee',
    defaultMessage: 'Assignee email',
    description: 'Some description',
  },
  yesOptionLabel: {
    id: 'example.application:yes.option.label',
    defaultMessage: 'Já',
    description: 'Some description',
  },
  noOptionLabel: {
    id: 'example.application:no.option.label',
    defaultMessage: 'Nei',
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
    defaultMessage: 'Símanúmerið þarf að vera gilt.',
    description: 'Error message when phone number is invalid.',
  },
  dataSchemeNationalId: {
    id: 'example.application:dataSchema.national.id',
    defaultMessage: 'Kennitala þarf að vera gild.',
    description: 'Error message when the kennitala is invalid.',
  },
  careerHistoryOther: {
    id: 'example.application:careerHistory.other',
    defaultMessage: 'Hvern hefur þú unnið fyrir áður?',
    description: 'Some description',
  },
  careerHistoryOtherError: {
    id: 'example.application:careerHistory.othertError',
    defaultMessage:
      'Vinsamlegast tilgreindu fyrir hvern þú hefur unnið fyrir áður?',
    description: 'Some description',
  },
  approvedByReviewerError: {
    id: 'example.application:approvedByReviewerError',
    defaultMessage:
      'Vinsamlegast tilgreindu hvort umsóknin sé samþykkt eða ekki',
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
      '# Markdown heading 1\n ## Markdown heading 2\n ### Markdown heading 3\n #### Markdown heading 4\n Regular markdown text',
    description: 'Example use of markdown',
  },
  markdownBulletListExample: {
    id: 'example.application:markdownBulletListExample#markdown',
    defaultMessage:
      'Markdown bullet list\n * bullet 1\n * bullet 2\n * bullet 3',
    description: 'Example use of markdown',
  },
  markdownNumberedListExample: {
    id: 'example.application:markdownNumberedListExample#markdown',
    defaultMessage:
      'Markdown numbered list\n 1. number 1\n 2. number 2\n 3. number 3',
    description: 'Example use of markdown',
  },
  markdownMiscExample: {
    id: 'example.application:markdownMiscExample#markdown',
    defaultMessage:
      'A markdown link will open in a new tab: [This is a link to Google!](http://google.com)\n\n Markdown value inserted {value1}\n\n **Bold text**\n\n *Italic text*\n\n ***Bold and italic text***',
    description: 'Example use of markdown link',
  },
  markdownCodeExample: {
    id: 'example.application:markdownCodeExample#markdown',
    defaultMessage:
      'Markdown code inline `const x = 123` with text\n\n Code block\n\n ```\n const x = 123\n if (x < 100) {\n   return true\n }\n```',
    description: 'Example use of markdown code',
  },
  customComponentDescription: {
    id: 'example.application:customComponentDescription#markdown',
    defaultMessage:
      '1. Try to use the shared components, `buildTextField`, `buildCheckboxField`, `buildSelectField`, `buildFileUploadField` and so on. This is most preferable to make the look and feel of the application more consistent and uniform.\n\n 2. If the shared components almost fullfill your needs but you need something more, consider consulting with the designer of the application and try to adjust the design to the built in components.\n\n 3. If the design can not be adjusted to the built in components, then consult Norda if a shared component can possibly be adjusted or expanded to fulfill your needs.\n\n 4. Is there another application that has made a similar custom component before? If so, then it should be a shared component. 5. If you still need a new component, ask yourself if this is a component that another application might also need in the future. If so make the new component shared. 6. Make a custom component if none of the above apply.',
    description: 'Rules for custom components',
  },
})
